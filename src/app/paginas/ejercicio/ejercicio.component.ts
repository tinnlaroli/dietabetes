import { Component, computed, signal } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';

interface EjercicioSugerido {
  nombre: string;
  parte: string;
  equipo: string;
  dificultad: string;
  duracion: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-ejercicio',
  imports: [TablerIconComponent],
  template: `
    <div class="contenedor">
      <header>
        <h1 class="titulo-pagina">Ejercicio</h1>
        <p class="subtitulo-pagina">Movimiento suave para cada dia.</p>
      </header>

      <div class="aviso-seguridad">
        <div class="aviso-icono">
          <tabler-icon icon="alert-triangle" [stroke]="2" />
        </div>
        <div>
          <h2>Consulta a tu medico</h2>
          <p>
            Antes de hacer ejercicio, pide el visto bueno a tu doctor. Empieza despacio y detente
            si sientes dolor o mareo.
          </p>
        </div>
      </div>

      <div class="filtros">
        @for (filtro of filtros; track filtro.valor) {
          <button
            class="chip-filtro"
            [class.activo]="filtroActivo() === filtro.valor"
            (click)="filtroActivo.set(filtro.valor)"
          >
            {{ filtro.etiqueta }}
          </button>
        }
      </div>

      <div class="lista-ejercicios">
        @for (ejercicio of ejerciciosVisibles(); track ejercicio.nombre) {
          <article class="tarjeta ejercicio">
            <div class="ejercicio-cabecera">
              <div class="ejercicio-icono">
                <tabler-icon [icon]="ejercicio.icono" [stroke]="1.5" />
              </div>
              <div class="ejercicio-principal">
                <h3>{{ ejercicio.nombre }}</h3>
                <span class="ejercicio-duracion">
                  <tabler-icon icon="clock" [stroke]="2" />
                  {{ ejercicio.duracion }}
                </span>
              </div>
              <span class="chip" [class]="claseDificultad(ejercicio.dificultad)">
                {{ ejercicio.dificultad }}
              </span>
            </div>
            <p class="ejercicio-descripcion">{{ ejercicio.descripcion }}</p>
            <div class="ejercicio-detalles">
              <span><strong>Parte del cuerpo:</strong> {{ ejercicio.parte }}</span>
              <span><strong>Equipo:</strong> {{ ejercicio.equipo }}</span>
            </div>
          </article>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .aviso-seguridad {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      background: #fef3c7;
      border: 2px solid #fde68a;
      border-radius: var(--radio-borde);
      padding: 1rem;
      margin-bottom: 1.25rem;
    }
    .aviso-seguridad .aviso-icono {
      color: #d97706;
      flex-shrink: 0;
    }
    .aviso-seguridad h2 {
      font-size: 1.05rem;
      font-weight: 800;
      margin: 0 0 0.25rem;
    }
    .aviso-seguridad p {
      font-size: 0.95rem;
      line-height: 1.5;
      color: #92400e;
      margin: 0;
    }
    .filtros {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
    }
    .chip-filtro {
      padding: 0.5rem 1rem;
      border-radius: 999px;
      border: 2px solid #e5e1d8;
      background: #ffffff;
      color: #5d5a52;
      font-weight: 700;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    .chip-filtro.activo {
      background: #2e7d32;
      border-color: #2e7d32;
      color: #ffffff;
    }
    .lista-ejercicios {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }
    .lista-ejercicios .tarjeta {
      margin-bottom: 0;
    }
    .ejercicio-cabecera {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .ejercicio-icono {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: #e7f4e8;
      color: #2e7d32;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ejercicio-principal {
      flex: 1;
      min-width: 0;
    }
    .ejercicio-principal h3 {
      font-size: 1.05rem;
      font-weight: 700;
      margin: 0 0 0.125rem;
    }
    .ejercicio-duracion {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: #757575;
      font-weight: 600;
    }
    .ejercicio-descripcion {
      color: #616161;
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0 0 0.75rem;
    }
    .ejercicio-detalles {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem 1rem;
      font-size: 0.9rem;
      color: #5d5a52;
    }
  `,
})
export class EjercicioComponent {
  readonly filtros = [
    { valor: 'todo', etiqueta: 'Todo' },
    { valor: 'brazos', etiqueta: 'Brazos' },
    { valor: 'piernas', etiqueta: 'Piernas' },
    { valor: 'cintura', etiqueta: 'Cintura' },
  ];

  readonly filtroActivo = signal('todo');

  readonly ejercicios: EjercicioSugerido[] = [
    {
      nombre: 'Caminata suave',
      parte: 'piernas',
      equipo: 'Zapatos comodos',
      dificultad: 'Baja',
      duracion: '20 a 30 min',
      descripcion: 'Camina a paso tranquilo cada dia; no se necesita equipo especial.',
      icono: 'walk',
    },
    {
      nombre: 'Caminata en el lugar',
      parte: 'piernas',
      equipo: 'Ninguno',
      dificultad: 'Baja',
      duracion: '10 min',
      descripcion: 'Ideal al ver la tele; sube un poco el pulso sin salir de casa.',
      icono: 'walk',
    },
    {
      nombre: 'Elevacion de talones',
      parte: 'piernas',
      equipo: 'Superficie firme',
      dificultad: 'Baja',
      duracion: '5 min',
      descripcion: 'De pie junto a una mesa, sube y baja los talones lentamente.',
      icono: 'target',
    },
    {
      nombre: 'Sentadillas apoyadas',
      parte: 'piernas',
      equipo: 'Una silla resistente',
      dificultad: 'Media',
      duracion: '10 min',
      descripcion: 'Siéntate y levantate de la silla de forma lenta y controlada.',
      icono: 'target',
    },
    {
      nombre: 'Estiramiento de brazos',
      parte: 'brazos',
      equipo: 'Ninguno',
      dificultad: 'Baja',
      duracion: '5 min',
      descripcion: 'Estira los brazos hacia arriba y hacia los lados con calma.',
      icono: 'target',
    },
    {
      nombre: 'Rotacion de hombros',
      parte: 'brazos',
      equipo: 'Ninguno',
      dificultad: 'Baja',
      duracion: '5 min',
      descripcion: 'Gira los hombros hacia adelante y hacia atras suavemente.',
      icono: 'target',
    },
    {
      nombre: 'Ejercicio con liga',
      parte: 'brazos',
      equipo: 'Banda de resistencia',
      dificultad: 'Media',
      duracion: '10 min',
      descripcion: 'Una banda elastica suave ayuda a fortalecer brazos y espalda.',
      icono: 'target',
    },
    {
      nombre: 'Rotacion de cintura',
      parte: 'cintura',
      equipo: 'Ninguno',
      dificultad: 'Baja',
      duracion: '5 min',
      descripcion: 'De pie, gira el torso de lado a lado con movimientos amplios.',
      icono: 'moon',
    },
    {
      nombre: 'Yoga en silla',
      parte: 'cintura',
      equipo: 'Una silla',
      dificultad: 'Baja',
      duracion: '15 min',
      descripcion: 'Posturas suaves sentado: elevacion de brazos y respiracion.',
      icono: 'leaf',
    },
    {
      nombre: 'Natacion o aquagym',
      parte: 'todo',
      equipo: 'Piscina',
      dificultad: 'Media',
      duracion: '30 min',
      descripcion: 'Ejercicio completo y muy suave para las articulaciones.',
      icono: 'droplet',
    },
  ];

  readonly ejerciciosVisibles = computed(() => {
    const filtro = this.filtroActivo();
    if (filtro === 'todo') return this.ejercicios;
    return this.ejercicios.filter((e) => e.parte === filtro);
  });

  claseDificultad(dificultad: string): string {
    if (dificultad === 'Baja') return 'chip--verde';
    if (dificultad === 'Media') return 'chip--amarillo';
    return 'chip--rojo';
  }
}