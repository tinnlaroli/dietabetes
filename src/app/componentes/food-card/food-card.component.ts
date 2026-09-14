import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { Alimento } from '../../modelo/modelo';

@Component({
  selector: 'app-food-card',
  imports: [TablerIconComponent],
  template: `
    <div class="food-card" [class.seleccionado]="seleccionado" [class]="'semaforo-' + alimento.semaforo">
      <button
        class="food-principal"
        (click)="tocar.emit()"
        [attr.aria-label]="'Agregar ' + alimento.nombre"
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
      @if (seleccionado) {
        <button
          class="quitar"
          (click)="quitar.emit()"
          [attr.aria-label]="'Quitar ' + alimento.nombre"
        >
          <tabler-icon icon="x" [stroke]="3" />
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .food-card {
      display: flex;
      align-items: stretch;
      gap: 0.5rem;
      background: #ffffff;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      transition: all 0.2s ease;
    }
    .semaforo-verde { border-color: #c8e6c9; }
    .semaforo-amarillo { border-color: #fff9c4; }
    .semaforo-rojo { border-color: #ffcdd2; }
    .seleccionado {
      border-color: #2e7d32 !important;
      background: #e8f5e9;
    }
    .food-principal {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      padding: 0.875rem 1rem;
      border: none;
      background: transparent;
      cursor: pointer;
      text-align: left;
      min-height: 56px;
    }
    .food-principal:active {
      transform: scale(0.99);
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
    .seleccionado .food-icono {
      background: #ffffff;
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
    .quitar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      min-height: 56px;
      align-self: center;
      margin: 0.375rem 0.5rem 0.375rem 0;
      border: none;
      border-radius: 12px;
      background: #fdecec;
      color: #c62828;
      cursor: pointer;
      flex-shrink: 0;
    }
    .quitar:active {
      transform: scale(0.94);
      background: #f5c6c6;
    }
  `,
})
export class FoodCardComponent {
  @Input({ required: true }) alimento!: Alimento;
  @Input() seleccionado = false;
  @Output() tocar = new EventEmitter<void>();
  @Output() quitar = new EventEmitter<void>();
}