import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';
import { HistorialService } from '../../servicios/historial.service';
import { RegistroComida, TipoComida } from '../../modelo/modelo';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, TablerIconComponent],
  template: `
    <div class="contenedor inicio">
      <header class="encabezado">
        <h1 class="titulo-pagina">{{ saludo }}</h1>
        <p class="subtitulo-pagina">Hoy es {{ fechaHoy }}</p>
      </header>

      <section class="seccion">
        <h2 class="seccion-titulo">Comidas de hoy</h2>
        @if (registrosDeHoy.length === 0) {
          <div class="tarjeta estado-vacio">
            <tabler-icon icon="coffee" [stroke]="1.5" />
            <span>Aun no registras una comida hoy.</span>
          </div>
        } @else {
          <ul class="lista-registros">
            @for (registro of registrosDeHoy; track $index) {
              <li class="tarjeta registro">
                <div class="registro-cabecera">
                  <span class="chip chip--verde">{{ etiquetaTipo(registro.tipo) }}</span>
                  <span class="registro-hora">
                    <tabler-icon icon="clock" [stroke]="2" />
                    {{ registro.hora }}
                  </span>
                </div>
                <p class="registro-alimentos">{{ listaAlimentos(registro) }}</p>
              </li>
            }
          </ul>
        }
      </section>

      <section class="seccion">
        <h2 class="seccion-titulo">Accesos rapidos</h2>
        <div class="atajos">
          @for (atajo of atajos; track atajo.ruta) {
            <a class="atajo" [routerLink]="atajo.ruta">
              <div class="atajo-icono" [class]="atajo.color">
                <tabler-icon [icon]="atajo.icono" [stroke]="1.5" />
              </div>
              <div class="atajo-texto">
                <strong>{{ atajo.titulo }}</strong>
                <span>{{ atajo.texto }}</span>
              </div>
              <tabler-icon class="atajo-flecha" icon="chevron-right" [stroke]="2" />
            </a>
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .encabezado {
      margin-bottom: 1.5rem;
    }
    .seccion {
      margin-bottom: 1.75rem;
    }
    .seccion-titulo {
      font-size: 1.15rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
    }
    .estado-vacio {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #757575;
      font-size: 1rem;
      font-weight: 500;
    }
    .lista-registros {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .registro-cabecera {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .registro-hora {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #757575;
      font-size: 0.95rem;
      font-weight: 600;
    }
    .registro-alimentos {
      color: #616161;
      font-size: 1rem;
      line-height: 1.5;
    }
    .atajos {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .atajo {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      background: #ffffff;
      border: 2px solid #e5e1d8;
      border-radius: var(--radio-borde);
      padding: 0.875rem 1rem;
      transition: transform 0.08s ease;
    }
    .atajo:active {
      transform: scale(0.985);
    }
    .atajo-icono {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .taquilla-verde {
      background: #e7f4e8;
      color: #2e7d32;
    }
    .taquilla-amarillo {
      background: #fef3c7;
      color: #f57f17;
    }
    .taquilla-rojo {
      background: #fdecec;
      color: #c62828;
    }
    .atajo-texto {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .atajo-texto strong {
      font-size: 1.05rem;
      font-weight: 700;
    }
    .atajo-texto span {
      font-size: 0.9rem;
      color: #757575;
    }
    .atajo-flecha {
      color: #bdbdbd;
    }
  `,
})
export class InicioComponent {
  private readonly historial = inject(HistorialService);

  readonly saludo = this.calcularSaludo();
  readonly fechaHoy = this.formatearFecha(new Date());

  readonly atajos = [
    {
      ruta: '/plato',
      icono: 'tools-kitchen-2',
      titulo: 'Creador de Plato',
      texto: 'Arma tu plato saludable',
      color: 'taquilla-verde',
    },
    {
      ruta: '/guia',
      icono: 'book-2',
      titulo: 'Guia Rapida',
      texto: 'El orden de la comida',
      color: 'taquilla-amarillo',
    },
    {
      ruta: '/ejercicio',
      icono: 'walk',
      titulo: 'Ejercicio',
      texto: 'Muevete cada dia',
      color: 'taquilla-verde',
    },
    {
      ruta: '/timers',
      icono: 'alarm',
      titulo: 'Horario',
      texto: 'Tus recordatorios',
      color: 'taquilla-rojo',
    },
    {
      ruta: '/salud',
      icono: 'activity-heartbeat',
      titulo: 'Mi Salud',
      texto: 'Entiende tu diabetes',
      color: 'taquilla-rojo',
    },
  ];

  get registrosDeHoy() {
    return this.historial.registrosDeHoy();
  }

  etiquetaTipo(tipo: TipoComida): string {
    if (tipo === 'desayuno') return 'Desayuno';
    if (tipo === 'comida') return 'Comida';
    return 'Cena';
  }

  listaAlimentos(registro: RegistroComida): string {
    return registro.alimentos.map((id) => this.historial.nombreAlimento(id)).join(', ');
  }

  private calcularSaludo(): string {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Buenos dias';
    if (hora >= 12 && hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  private formatearFecha(fecha: Date): string {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
  }
}