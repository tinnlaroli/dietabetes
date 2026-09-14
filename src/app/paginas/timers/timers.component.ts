import { Component, inject, signal } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { AlarmasService } from '../../servicios/alarmas.service';
import { TipoComida } from '../../modelo/modelo';

@Component({
  selector: 'app-timers',
  imports: [TablerIconComponent],
  template: `
    <div class="contenedor">
      @if (alarmas.sonando(); as sonido) {
        <div class="banner-sonando">
          <div class="banner-icono">
            <tabler-icon icon="bell" [stroke]="2" />
          </div>
          <div class="banner-texto">
            <strong>Es hora de la {{ etiqueta(sonido.tipo) }}</strong>
            <span>Momento de comer a las {{ sonido.hora }}.</span>
          </div>
          <button class="boton boton--rojo banner-silenciar" (click)="alarmas.silenciarAlarma()">
            <tabler-icon icon="volume-off" [stroke]="2" />
            Silenciar
          </button>
        </div>
      }

      <header>
        <h1 class="titulo-pagina">Horario de comidas</h1>
        <p class="subtitulo-pagina">La app suena para recordarte comer en el orden correcto.</p>
      </header>

      <button
        class="interruptor"
        role="switch"
        [attr.aria-checked]="alarmas.activo()"
        [class.encendido]="alarmas.activo()"
        (click)="alarmas.alternarActivo()"
      >
        <span class="interruptor-track">
          <span class="interruptor-knob"></span>
        </span>
        <span class="interruptor-texto">
          {{ alarmas.activo() ? 'Alarmas activas' : 'Alarmas apagadas' }}
        </span>
      </button>

      <h2 class="seccion-titulo">Horarios</h2>
      @for (item of horarioItems; track item.tipo) {
        <label class="campo-hora">
          <tabler-icon [icon]="item.icono" [stroke]="1.5" />
          <span>{{ item.etiqueta }}</span>
          <input
            type="time"
            [value]="hora(item.tipo)"
            (input)="cambiarHora(item.tipo, $any($event.target).value)"
          />
        </label>
      }

      <button class="boton boton--primario guardar" (click)="guardar()">
        <tabler-icon icon="device-floppy" [stroke]="2" />
        Guardar horario
      </button>

      @if (!notificacionesPermitidas) {
        <section class="tarjeta notif-tarjeta">
          <h2>Notificaciones</h2>
          <p>
            Activa las notificaciones para recibir un recordatorio aunque tengas la app cerrada.
          </p>
          <button class="boton boton--secundario" (click)="pedirPermiso()">
            <tabler-icon icon="bell" [stroke]="2" />
            Permitir notificaciones
          </button>
        </section>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .banner-sonando {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #fdecec;
      border: 3px solid #c62828;
      border-radius: var(--radio-borde);
      padding: 1rem;
      margin-bottom: 1.25rem;
      animation: parpadeo 1s ease infinite alternate;
    }
    @keyframes parpadeo {
      from {
        box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.35);
      }
      to {
        box-shadow: 0 0 0 10px rgba(198, 40, 40, 0);
      }
    }
    .banner-icono {
      color: #c62828;
      flex-shrink: 0;
    }
    .banner-texto {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .banner-texto strong {
      font-size: 1.1rem;
      font-weight: 800;
      color: #b71c1c;
    }
    .banner-texto span {
      font-size: 0.95rem;
      color: #b71c1c;
    }
    .banner-silenciar {
      min-height: 44px;
      width: auto;
      padding: 0.5rem 0.875rem;
      font-size: 0.95rem;
      border-radius: 12px;
      flex-shrink: 0;
    }
    .interruptor {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      background: #ffffff;
      border: 2px solid #e5e1d8;
      border-radius: var(--radio-borde);
      padding: 1rem;
      margin-bottom: 1.25rem;
    }
    .interruptor-track {
      width: 56px;
      height: 32px;
      border-radius: 999px;
      background: #e0e0e0;
      position: relative;
      transition: background 0.2s ease;
      flex-shrink: 0;
    }
    .interruptor-knob {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      transition: transform 0.2s ease;
    }
    .interruptor.encendido .interruptor-track {
      background: #2e7d32;
    }
    .interruptor.encendido .interruptor-knob {
      transform: translateX(24px);
    }
    .interruptor-texto {
      font-weight: 700;
      font-size: 1rem;
    }
    .seccion-titulo {
      font-size: 1.15rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
    }
    .campo-hora {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #ffffff;
      border: 2px solid #e5e1d8;
      border-radius: var(--radio-borde);
      padding: 0.875rem 1rem;
      margin-bottom: 0.75rem;
    }
    .campo-hora tabler-icon {
      color: #2e7d32;
      flex-shrink: 0;
    }
    .campo-hora span {
      flex: 1;
      font-weight: 700;
    }
    .campo-hora input {
      font-size: 1rem;
      padding: 0.25rem;
      border: 2px solid #e5e1d8;
      border-radius: 10px;
      font-family: inherit;
      color: #212121;
    }
    .guardar {
      margin-bottom: 1.5rem;
    }
    .notif-tarjeta p {
      color: #5d5a52;
      font-size: 0.98rem;
      margin-bottom: 1rem;
    }
  `,
})
export class TimersComponent {
  readonly alarmas = inject(AlarmasService);

  readonly horarioItems: { tipo: TipoComida; etiqueta: string; icono: string }[] = [
    { tipo: 'desayuno', etiqueta: 'Desayuno', icono: 'coffee' },
    { tipo: 'comida', etiqueta: 'Comida', icono: 'bowl-filled' },
    { tipo: 'cena', etiqueta: 'Cena', icono: 'moon' },
  ];

  private readonly desayuno = signal(this.alarmas.horarios().desayuno);
  private readonly comida = signal(this.alarmas.horarios().comida);
  private readonly cena = signal(this.alarmas.horarios().cena);

  get notificacionesPermitidas(): boolean {
    return typeof Notification !== 'undefined' && Notification.permission === 'granted';
  }

  hora(tipo: TipoComida): string {
    if (tipo === 'desayuno') return this.desayuno();
    if (tipo === 'comida') return this.comida();
    return this.cena();
  }

  cambiarHora(tipo: TipoComida, valor: string) {
    if (tipo === 'desayuno') this.desayuno.set(valor);
    else if (tipo === 'comida') this.comida.set(valor);
    else this.cena.set(valor);
  }

  guardar() {
    this.alarmas.guardarHorario('desayuno', this.desayuno());
    this.alarmas.guardarHorario('comida', this.comida());
    this.alarmas.guardarHorario('cena', this.cena());
  }

  etiqueta(tipo: TipoComida): string {
    if (tipo === 'desayuno') return 'Desayuno';
    if (tipo === 'comida') return 'Comida';
    return 'Cena';
  }

  async pedirPermiso() {
    await this.alarmas.pedirPermisoNotificaciones();
  }

  ngOnInit() {
    this.alarmas.iniciarVigilancia();
  }

  ngOnDestroy() {
    this.alarmas.detenerVigilancia();
  }
}