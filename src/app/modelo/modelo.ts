export type Categoria =
  | 'verdura'
  | 'proteina'
  | 'carbohidrato-fuerte'
  | 'carbohidrato-medio'
  | 'grasa';

export type Semaforo = 'verde' | 'amarillo' | 'rojo';

export interface Alimento {
  id: string;
  nombre: string;
  categoria: Categoria;
  carbs: number;
  porcion: string;
  explicacion: string;
  icono: string;
  semaforo: Semaforo;
  consultaUsda: string;
}

export interface Nutrientes {
  arquitectura: string;
  carbos: number;
  fibra: number;
  proteina: number;
  grasas: number;
}

export interface AlimentoEnPlato {
  alimento: Alimento;
  porciones: number;
}

export type TipoComida = 'desayuno' | 'comida' | 'cena';

export interface RegistroComida {
  fecha: string;
  tipo: TipoComida;
  hora: string;
  alimentos: string[];
}

export interface Ejercicio {
  id: string;
  nombre: string;
  gifUrl: string | null;
  duracionMin: number;
  pasos: string[];
  icono: string;
}