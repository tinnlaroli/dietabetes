import { Component, inject } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { NutricionService } from '../../servicios/nutricion.service';

@Component({
  selector: 'app-guia',
  imports: [TablerIconComponent],
  template: `
    <div class="contenedor">
      <header>
        <h1 class="titulo-pagina">Guia rapida</h1>
        <p class="subtitulo-pagina">Lo esencial para planear tus comidas.</p>
      </header>

      <section class="tarjeta">
        <h2>Orden de la comida</h2>
        <p class="intro">Este orden ayuda a que tu azucar suba despacio.</p>
        <ol class="orden-pasos">
          @for (paso of pasos; track paso.numero) {
            <li class="paso">
              <span class="paso-numero">{{ paso.numero }}</span>
              <div class="paso-contenido">
                <h3>{{ paso.titulo }}</h3>
                <p>{{ paso.texto }}</p>
              </div>
              <tabler-icon class="paso-icono" icon="step-into" [stroke]="1.5" />
            </li>
          }
        </ol>
      </section>

      <section class="tarjeta">
        <h2>Que puedes comer</h2>
        <div class="grupos">
          @for (grupo of grupos; track grupo.titulo) {
            <div class="grupo">
              <div class="grupo-icono" [class]="grupo.color">
                <tabler-icon [icon]="grupo.icono" [stroke]="1.5" />
              </div>
              <div class="grupo-info">
                <h3>{{ grupo.titulo }}</h3>
                <p>{{ grupo.texto }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <section class="tarjeta">
        <h2>Que evitar</h2>
        <ul class="lista-evitar">
          @for (item of evitar; track item) {
            <li>
              <tabler-icon icon="ban" [stroke]="2" />
              <span>{{ item }}</span>
            </li>
          }
        </ul>
      </section>

      <section class="tarjeta">
        <h2>Carbohidratos y puntos</h2>
        <p class="intro">Cada comida conviene que tenga maximo 1 punto de carbohidratos.</p>
        <ul class="lista-puntos">
          @for (ejemplo of ejemplosPuntos; track ejemplo.nombre) {
            <li>
              <div class="ejemplo-texto">
                <span class="ejemplo-nombre">{{ ejemplo.nombre }}</span>
                @if (nutricion(ejemplo.id); as datos) {
                  <span class="ejemplo-nutricion"
                    >100 g: {{ datos.carbos }} g carbos · {{ datos.fibra }} g fibra</span
                  >
                }
              </div>
              <span class="chip chip--amarillo">{{ ejemplo.puntos }}</span>
            </li>
          }
        </ul>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .intro {
      color: #5d5a52;
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }
    .orden-pasos {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .paso {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      background: #ffffff;
      border: 2px solid #e5e1d8;
      border-radius: 14px;
      padding: 0.875rem;
    }
    .paso-numero {
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
      border-radius: 50%;
      background: #2e7d32;
      color: #ffffff;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .paso-contenido {
      flex: 1;
    }
    .paso-contenido h3 {
      margin: 0 0 0.25rem;
    }
    .paso-contenido p {
      color: #616161;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .paso-icono {
      color: #2e7d32;
      margin-top: 0.25rem;
    }
    .grupos {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .grupo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #ffffff;
      border: 2px solid #e5e1d8;
      border-radius: 14px;
      padding: 0.875rem;
    }
    .grupo-icono {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .grupo-icono.verde {
      background: #e7f4e8;
      color: #2e7d32;
    }
    .grupo-icono.amarillo {
      background: #fef3c7;
      color: #d97706;
    }
    .grupo-info h3 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
    }
    .grupo-info p {
      margin: 0;
      color: #616161;
      font-size: 0.9rem;
      line-height: 1.45;
    }
    .lista-evitar {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }
    .lista-evitar li {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      background: #fdecec;
      border: 2px solid #f5c6c6;
      border-radius: 12px;
      padding: 0.625rem 0.875rem;
      font-weight: 600;
      color: #b71c1c;
    }
    .lista-puntos {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .lista-puntos li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      background: #faf7f1;
      border: 2px solid #e5e1d8;
      border-radius: 12px;
      padding: 0.625rem 0.875rem;
    }
    .ejemplo-texto {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .ejemplo-nombre {
      font-weight: 600;
    }
    .ejemplo-nutricion {
      font-size: 0.85rem;
      color: #757575;
    }
  `,
})
export class GuiaComponent {
  private readonly nutricionServicio = inject(NutricionService);
  readonly pasos = [
    {
      numero: '1',
      titulo: 'Verduras',
      texto: 'Empieza con verduras: nopales, calabacitas o ensalada. Son libres y te llenan.',
    },
    {
      numero: '2',
      titulo: 'Proteina',
      texto: 'Despues agrega huevo, pollo, pescado o queso. Te mantienen satisfecho.',
    },
    {
      numero: '3',
      titulo: 'Carbohidrato',
      texto: 'Al final, una porcion de tortilla, arroz o frijoles. Elige solo si tienes espacio.',
    },
  ];

  readonly grupos = [
    {
      titulo: 'Verduras',
      texto: 'Libres: nopales, calabacitas, espinacas y pepino.',
      icono: 'leaf',
      color: 'verde',
    },
    {
      titulo: 'Proteinas',
      texto: 'Huevo, pollo, pescado, carnes magras y quesos.',
      icono: 'egg',
      color: 'verde',
    },
    {
      titulo: 'Carbohidratos',
      texto: 'Tortilla, arroz, frijoles y avena, con limite de 1 punto.',
      icono: 'bowl',
      color: 'amarillo',
    },
    {
      titulo: 'Grasas buenas',
      texto: 'Aguacate, nueces y almendras, en cantidades pequenas.',
      icono: 'avocado',
      color: 'verde',
    },
  ];

  readonly evitar = [
    'Jugos y licuados de fruta',
    'Refrescos y bebidas azucaradas',
    'Pan blanco y bolleria',
    'Cereales de caja endulzados',
    'Dulces, postres y mermeladas',
    'Azucar de mesa en cafes y tes',
  ];

  readonly ejemplosPuntos = [
    { id: 'arroz', nombre: '1/2 taza de arroz', puntos: '1 punto' },
    { id: 'tortilla', nombre: '1 tortilla de maiz', puntos: '1/2 punto' },
    { id: 'tortilla', nombre: '2 tortillas juntas', puntos: '1 punto' },
    { id: 'frijoles', nombre: '1/2 taza de frijoles', puntos: '1/2 punto' },
    { id: 'avena', nombre: '1/2 taza de avena', puntos: '1/2 punto' },
  ];

  nutricion(id: string) {
    return this.nutricionServicio.obtener(id);
  }
}