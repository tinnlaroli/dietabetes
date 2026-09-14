import { Injectable } from '@angular/core';
import datos from '../datos/alimentos-nutricion.json';

export interface InfoNutricional {
  carbos: number;
  fibra: number;
  proteina: number;
  grasas: number;
}

@Injectable({ providedIn: 'root' })
export class NutricionService {
  private indice = (datos as { indice: Record<string, InfoNutricional> }).indice;

  obtener(alimentoId: string): InfoNutricional | null {
    return this.indice[alimentoId] ?? null;
  }
}