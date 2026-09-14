import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TablerIconComponent } from '@tabler/icons-angular';
import { PlatoService } from '../../servicios/plato.service';

@Component({
  selector: 'app-plato-resumen',
  imports: [TablerIconComponent, DecimalPipe],
  template: `
    <div class="plato-resumen">
      <div class="carbs-medidor">
        <div class="medidor-barra">
          <div class="medidor-relleno" [style.width.%]="porcentajeCarbos"></div>
        </div>
        <div class="medidor-texto">
          <span class="medidor-puntos" [class]="'color-' + colorCarbos">
            {{ totalCarbos | number:'1.1-1' }} / 1.0 puntos
          </span>
          <span class="medidor-label">Carbohidratos</span>
        </div>
      </div>
      <div class="plato-secciones">
        @if (plato.length === 0) {
          <div class="plato-vacio">
            <tabler-icon icon="leaf" [stroke]="1.5" />
            <span>Toca un alimento para agregarlo a tu plato</span>
          </div>
        } @else {
          <div class="plato-items">
            @for (item of plato; track item.alimento.id) {
              <div class="plato-item">
                <tabler-icon [icon]="item.alimento.icono" [stroke]="1.5" />
                <span class="item-nombre">{{ item.alimento.nombre }}</span>
                <span class="item-porcion">x{{ item.porciones }}</span>
                <button
                  class="item-quitar"
                  (click)="quitar(item.alimento.id)"
                  [attr.aria-label]="'Quitar ' + item.alimento.nombre"
                >
                  <tabler-icon icon="x" [stroke]="3" />
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .plato-resumen {
      background: #ffffff;
      border-radius: 16px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 1rem;
    }
    .carbs-medidor {
      margin-bottom: 1rem;
    }
    .medidor-barra {
      height: 12px;
      background: #e8f5e9;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .medidor-relleno {
      height: 100%;
      border-radius: 6px;
      transition: width 0.3s ease, background 0.3s ease;
      background: #2e7d32;
    }
    .medidor-relleno[style*="50"] { background: #ffc107; }
    .medidor-relleno[style*="75"] { background: #ff9800; }
    .medidor-relleno[style*="100"] { background: #f44336; }
    .medidor-texto {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .medidor-puntos {
      font-weight: 600;
      font-size: 1rem;
    }
    .medidor-label {
      color: #757575;
      font-size: 0.875rem;
    }
    .color-verde { color: #2e7d32; }
    .color-amarillo { color: #f57f17; }
    .color-rojo { color: #c62828; }
    .plato-secciones {
      min-height: 60px;
    }
    .plato-vacio {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #9e9e9e;
      padding: 1.5rem;
      text-align: center;
      font-size: 0.95rem;
    }
    .plato-items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .plato-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      background: #e8f5e9;
      padding: 0.5rem 0.75rem;
      border-radius: 24px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1b5e20;
    }
    .item-porcion {
      font-weight: 700;
      margin-left: 0.25rem;
    }
    .item-quitar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      margin-left: 0.25rem;
      border: none;
      border-radius: 50%;
      background: #fdecec;
      color: #c62828;
      cursor: pointer;
      flex-shrink: 0;
    }
    .item-quitar:active {
      transform: scale(0.92);
    }
  `,
})
export class PlatoResumenComponent {
  private platoServicio = inject(PlatoService);

  get plato() {
    return this.platoServicio.platoResumen();
  }

  get totalCarbos() {
    return this.platoServicio.totalCarbos();
  }

  get porcentajeCarbos() {
    return Math.min(this.totalCarbos * 100, 100);
  }

  get colorCarbos(): string {
    const t = this.totalCarbos;
    if (t <= 0.5) return 'verde';
    if (t <= 0.75) return 'amarillo';
    return 'rojo';
  }

  quitar(id: string) {
    this.platoServicio.quitar(id);
  }
}