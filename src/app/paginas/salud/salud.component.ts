import { Component } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';

@Component({
  selector: 'app-salud',
  imports: [TablerIconComponent],
  template: `
    <div class="contenedor">
      <header>
        <h1 class="titulo-pagina">Mi salud</h1>
        <p class="subtitulo-pagina">Aprende en simple lo que pasa en tu cuerpo.</p>
      </header>

      <section class="lista">
        @for (tarjeta of tarjetas; track tarjeta.titulo) {
          <article class="tarjeta">
            <div class="salud-icono" [class]="tarjeta.color">
              <tabler-icon [icon]="tarjeta.icono" [stroke]="1.5" />
            </div>
            <h2>{{ tarjeta.titulo }}</h2>
            <p class="salud-texto">{{ tarjeta.texto }}</p>
          </article>
        }
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .lista {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .salud-icono {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
    }
    .salud-icono.verde {
      background: #e7f4e8;
      color: #2e7d32;
    }
    .salud-icono.amarillo {
      background: #fef3c7;
      color: #d97706;
    }
    .salud-icono.rojo {
      background: #fdecec;
      color: #c62828;
    }
    .salud-texto {
      color: #5d5a52;
      font-size: 1rem;
      line-height: 1.55;
      margin: 0;
    }
  `,
})
export class SaludComponent {
  readonly tarjetas = [
    {
      icono: 'heartbeat',
      titulo: 'Que es la diabetes',
      color: 'rojo',
      texto: 'La diabetes es una condicion en la que el cuerpo no usa bien el azucar de la sangre. Por eso importa cuidar lo que comes y moverte cada dia. Con buenos habitos se puede vivir muy bien.',
    },
    {
      icono: 'droplet',
      titulo: 'Que es la HbA1c',
      color: 'amarillo',
      texto: 'La HbA1c es una medida que muestra tu azucar promedio de los ultimos dos o tres meses. Se revisa con una muestra de sangre. Un valor alto indica que el azucar ha estado alta durante ese tiempo.',
    },
    {
      icono: 'moon',
      titulo: 'Por que importa el orden',
      color: 'verde',
      texto: 'Comer primero verduras, luego proteina y al final carbohidratos hace que el azucar suba mas lento. Asi evitas picos despues de comer y te sientes satisfecho por mas tiempo.',
    },
    {
      icono: 'target',
      titulo: 'Los carbohidratos',
      color: 'amarillo',
      texto: 'Los carbohidratos son los alimentos que mas suben el azucar: pan, tortilla, arroz, frijoles y frutas. No hace falta quitarlos, solo elegir porciones pequenas, hasta 1 punto por comida.',
    },
    {
      icono: 'bulb',
      titulo: 'El ejercicio',
      color: 'verde',
      texto: 'Moverse ayuda a que las celulas usen mejor el azucar. Caminar 30 minutos al dia, estirar y nadar son opciones suaves y seguras. Siempre consulta a tu medico antes de empezar.',
    },
  ];
}