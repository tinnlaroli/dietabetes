# Plato Sano

PWA en español para reducir la hemoglobina glucosilada (HbA1c) a traves de metas sencillas y menus que se arman por puntos de carbohidratos.

> Pedagogia: lo unico que hay que memorizar es **comer verduras primero, luego proteina y al final carbohidratos**, con maximo 1 punto de carbohidratos por comida.

## Funciones

- **Creador de plato**: elige verduras (libres), proteinas y carbohidratos (1 punto maximo). La app avisa con un modal cuando se excede el limite y propone cambios.
- **Medidor de carbohidratos**: barra visual verde/amarillo/rojo que muestra cuantos puntos lleva el plato.
- **Guia rapida**: orden de la comida, grupos de alimentos, que evitar y tabla de carbohidratos con datos nutricionales (por cada 100 g).
- **Ejercicio**: lista curada de ejercicios seguros para adultos mayores con filtros y aviso medico.
- **Horario de comidas**: alarmas de desayuno/comida/cena con sonido, vibracion y notificaciones.
- **Mi salud**: explicaciones sencillas sobre diabetes, HbA1c, carbohidratos y ejercicio.
- **PWA**: funciona sin internet, se instala en el telefono.
- **Sin emojis**: iconos de Tabler, tipografia Inter, contraste WCAG AAA, area tactil minima de 48x48 dp.

## Stack

- Angular 22 (standalone, lazy loading)
- PWA con `@angular/pwa` (service worker `ngsw`)
- Tabler Icons Angular
- @fontsource/inter
- Datos nutricionales de **USDA FoodData Central** (incrustados en build para uso offline)

## Requisitos

- Node.js 20+
- Angular CLI (`npm i -g @angular/cli`)

## Desarrollo local

```bash
npm install
npx ng serve
```

Abre `http://localhost:4200`. El service worker esta desactivado en desarrollo; para probar la PWA usa el build de produccion:

```bash
npx ng build
npx http-server dist/dietabetes/browser -p 8080 -c-1
```

## Datos nutricionales USDA

La app incluye valores de referencia incrustados. Para refrescarlos con la API oficial:

```bash
# Crea el archivo .env con tu clave (no se sube al repo)
echo "USDA_API_KEY=tu_clave_aqui" > .env
node scripts/fetch-usda.mjs --force
```

La clave se obtiene gratis en [api.data.gov](https://api.data.gov/signup/).

## Iconos PWA

```bash
node scripts/generar-iconos.mjs
```

## Deploy en Vercel (free tier)

1. Sube el repo a GitHub.
2. En Vercel: **Add New Project** → importa el repositorio.
3. Vercel detecta Angular automaticamente (build: `npm run build`, output: `dist/dietabetes/browser`).

`vercel.json` incluye los rewrites para las rutas del SPA y cabeceras de cache para los assets de la PWA. Todo es estatico, sin funciones serverless, por lo que entra en el plan gratuito.