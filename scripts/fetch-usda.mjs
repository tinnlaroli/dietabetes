import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const CLAVE_ENV = 'USDA_API_KEY';
let API_KEY = process.env[CLAVE_ENV];

if (!API_KEY) {
  try {
    const env = await readFile(resolve(ROOT, '.env'), 'utf8');
    const linea = env.split('\n').find((l) => l.startsWith(`${CLAVE_ENV}=`));
    if (linea) API_KEY = linea.split('=').slice(1).join('=').trim();
  } catch {
    /* no .env */
  }
}

if (!API_KEY) API_KEY = 'DEMO_KEY';

const { alimentos } = await import('../src/app/datos/alimentos.ts');

const RUTA_SALIDA = resolve(ROOT, 'src/app/datos/alimentos-nutricion.json');

const NUTRIENTES = {
  1005: 'carbos',
  1079: 'fibra',
  1003: 'proteina',
  1004: 'grasas',
};

async function buscar(consulta) {
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}`;
  const cuerpo = JSON.stringify({
    query: consulta,
    pageSize: 1,
    dataType: ['SR Legacy', 'Foundation'],
    pageNumber: 1,
  });
  const respuesta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: cuerpo,
  });
  if (!respuesta.ok) return null;
  const datos = await respuesta.json();
  const alimento = datos.foods?.[0];
  if (!alimento) return null;
  const resultado = {};
  for (const nutriente of alimento.foodNutrients ?? []) {
    const clave = NUTRIENTES[nutriente.nutrientNumber];
    if (clave) resultado[clave] = nutriente.value ?? 0;
  }
  return resultado;
}

let indice = {};

try {
  const existente = await readFile(RUTA_SALIDA, 'utf8');
  const datos = JSON.parse(existente);
  indice = datos.indice ?? {};
} catch {
  /* archivo no existe aún */
}

let consultas = 0;
let actualizaciones = 0;

for (const alimento of alimentos) {
  if (!alimento.consultaUsda) continue;
  const existente = indice[alimento.id];
  if (existente && !process.argv.includes('--force')) continue;
  process.stdout.write(`  ${alimento.nombre}...`);
  const datos = await buscar(alimento.consultaUsda);
  if (datos) {
    indice[alimento.id] = datos;
    console.log(` OK (${datos.carbos ?? 0}g carbs)`);
    actualizaciones++;
  } else {
    console.log(' sin datos, conservando respaldo');
  }
  consultas++;
  if (consultas % 5 === 0) await new Promise((r) => setTimeout(r, 1000));
}

const salida = {
  fuente: `USDA FoodData Central (actualizado ${new Date().toISOString().slice(0, 10)})`,
  indice,
};

await writeFile(RUTA_SALIDA, JSON.stringify(salida, null, 2) + '\n', 'utf8');
console.log(`\nListo: ${actualizaciones} actualizados, ${consultas} consultados.`);
console.log(`Guardado en ${RUTA_SALIDA}`);