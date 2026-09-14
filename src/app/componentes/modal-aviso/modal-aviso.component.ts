import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';

@Component({
  selector: 'app-modal-aviso',
  imports: [TablerIconComponent],
  template: `
    @if (visible) {
      <div class="modal-fondo" (click)="cerrar.emit()">
        <div class="modal-contenido" (click)="$event.stopPropagation()">
          <div class="modal-icono">
            <tabler-icon icon="alert-triangle" [stroke]="2" />
          </div>
          <h3 class="modal-titulo">{{ titulo }}</h3>
          <p class="modal-mensaje">{{ mensaje }}</p>
          <div class="modal-acciones">
            @if (muestraCambiar) {
              <button class="btn-cambiar" (click)="cambiar.emit()">
                Cambiar a {{ quiereNombre }}
              </button>
            }
            <button class="btn-mantener" (click)="cerrar.emit()">
              {{ muestraCambiar ? 'Mantener' : 'Entendido' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .modal-fondo {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-contenido {
      background: #ffffff;
      border-radius: 20px;
      padding: 2rem 1.5rem;
      max-width: 360px;
      width: 100%;
      text-align: center;
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .modal-icono {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #fff3e0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      color: #e65100;
    }
    .modal-titulo {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: #212121;
    }
    .modal-mensaje {
      font-size: 1rem;
      color: #616161;
      margin: 0 0 1.5rem;
      line-height: 1.5;
    }
    .modal-acciones {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .btn-cambiar {
      padding: 0.875rem 1rem;
      border-radius: 12px;
      border: none;
      background: #2e7d32;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      min-height: 48px;
      transition: all 0.2s ease;
    }
    .btn-cambiar:active {
      transform: scale(0.98);
      background: #1b5e20;
    }
    .btn-mantener {
      padding: 0.875rem 1rem;
      border-radius: 12px;
      border: 2px solid #e0e0e0;
      background: #ffffff;
      color: #616161;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      min-height: 48px;
      transition: all 0.2s ease;
    }
    .btn-mantener:active {
      transform: scale(0.98);
      background: #f5f5f5;
    }
  `,
})
export class ModalAvisoComponent {
  @Input() visible = false;
  @Input() titulo = '';
  @Input() mensaje = '';
  @Input() quiereNombre = '';
  @Input() muestraCambiar = true;
  @Output() cerrar = new EventEmitter<void>();
  @Output() cambiar = new EventEmitter<void>();
}