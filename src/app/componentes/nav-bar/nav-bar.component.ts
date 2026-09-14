import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, TablerIconComponent],
  template: `
    <nav class="nav-bar">
      @for (item of items; track item.ruta) {
        <a class="nav-item" [routerLink]="item.ruta" routerLinkActive="activo">
          <tabler-icon [icon]="item.icono" [stroke]="2" />
          <span class="nav-label">{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
  styles: `
    :host {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      border-top: 1px solid #e0e0e0;
      padding: 0.25rem 0;
      padding-bottom: env(safe-area-inset-bottom, 0.25rem);
      z-index: 100;
    }
    .nav-bar {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.125rem;
      padding: 0.375rem 0.75rem;
      text-decoration: none;
      color: #757575;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.2s ease;
      min-width: 48px;
      min-height: 48px;
      justify-content: center;
    }
    .nav-item:active {
      transform: scale(0.95);
    }
    .activo {
      color: #2e7d32;
      background: #e8f5e9;
    }
    .nav-label {
      margin-top: 1px;
    }
  `,
})
export class NavBarComponent {
  items = [
    { ruta: '/', icono: 'home', label: 'Inicio' },
    { ruta: '/plato', icono: 'tools-kitchen-2', label: 'Plato' },
    { ruta: '/guia', icono: 'book-2', label: 'Guia' },
    { ruta: '/ejercicio', icono: 'walk', label: 'Ejercicio' },
    { ruta: '/timers', icono: 'alarm', label: 'Horario' },
  ];
}