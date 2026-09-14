import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { Alimento } from '../../modelo/modelo';

@Component({
  selector: 'app-food-card',
  imports: [TablerIconComponent],
  template: `
    <button
      class="food-card"
      [class.seleccionado]="seleccionado"
      [class]="'semaforo-' + alimento.semaforo"
      (click)="tocar.emit()"
    >
      <div class="food-icono">
        <tabler-icon [icon]="alimento.icono" [stroke]="1.5" />
      </div>
      <div class="food-info">
        <span class="food-nombre">{{ alimento.nombre }}</span>
        <span class="food-porcion">{{ alimento.porcion }}</span>
      </div>
      <div class="food-carbs">
        <span class="carbs-valor" [class]="'color-' + alimento.semaforo">
          {{ alimento.carbs === 0 ? 'Libre' : alimento.carbs + ' pt' }}
        </span>
      </div>
    </button>
  `,
  styles: `
    :host {
      display: block;
    }
    .food-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.875rem 1rem;
      background: #ffffff;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 56px;
      text-align: left;
    }
    .food-card:active {
      transform: scale(0.98);
    }
    .semaforo-verde { border-color: #c8e6c9; }
    .semaforo-amarillo { border-color: #fff9c4; }
    .semaforo-rojo { border-color: #ffcdd2; }
    .seleccionado {
      border-color: #2e7d32 !important;
      background: #e8f5e9;
    }
    .food-icono {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: #f5f5f5;
      flex-shrink: 0;
    }
    .food-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .food-nombre {
      font-weight: 600;
      font-size: 0.95rem;
      color: #212121;
    }
    .food-porcion {
      font-size: 0.8rem;
      color: #757575;
    }
    .food-carbs {
      flex-shrink: 0;
    }
    .carbs-valor {
      font-weight: 700;
      font-size: 0.85rem;
    }
    .color-verde { color: #2e7d32; }
    .color-amarillo { color: #f57f17; }
    .color-rojo { color: #c62828; }
  `,
})
export class FoodCardComponent {
  @Input({ required: true }) alimento!: Alimento;
  @Input() seleccionado = false;
  @Output() tocar = new EventEmitter<void>();
}