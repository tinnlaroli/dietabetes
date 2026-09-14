import { Injectable, Signal, computed, signal } from '@angular/core';
import { TipoComida } from '../modelo/modelo';

export interface AlarmaSonando {
  tipo: TipoComida;
  hora: string;
}

@Injectable({ providedIn: 'root' })
export class AlarmasService {
  private readonly claveHorarios = 'platosano-horarios';
  private readonly claveActivo = 'platosano-alarmas-activo';

  horarios = signal<Record<TipoComida, string>>(this.cargarHorarios());
  activo = signal(this.cargarActivo());
  sonando = signal<AlarmaSonando | null>(null);

  private intervaloSonando: ReturnType<typeof setInterval> | null = null;
  private horaDisparada = '';

  alternarActivo() {
    this.activo.update((a) => !a);
    try {
      localStorage.setItem(this.claveActivo, String(this.activo()));
    } catch {
      /* sin almacenamiento */
    }
    if (!this.activo()) {
      this.sonando.set(null);
    }
  }

  guardarHorario(tipo: TipoComida, hora: string) {
    this.horarios.update((horarios) => ({ ...horarios, [tipo]: hora }));
    try {
      localStorage.setItem(this.claveHorarios, JSON.stringify(this.horarios()));
    } catch {
      /* sin almacenamiento */
    }
  }

  async pedirPermisoNotificaciones(): Promise<boolean> {
    if (typeof Notification === 'undefined') return false;
    const solicitud = await Notification.requestPermission();
    return solicitud === 'granted';
  }

  iniciarVigilancia() {
    if (this.intervaloSonando) return;
    this.intervaloSonando = setInterval(() => this.revisar(), 20000);
    this.revisar();
  }

  detenerVigilancia() {
    if (this.intervaloSonando) {
      clearInterval(this.intervaloSonando);
      this.intervaloSonando = null;
    }
  }

  silenciarAlarma() {
    this.sonando.set(null);
    this.horaDisparada = '';
  }

  revisar() {
    if (!this.activo()) return;
    const ahora = new Date();
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    if (horaActual === this.horaDisparada) return;

    const entradas = Object.entries(this.horarios()) as [TipoComida, string][];
    for (const [tipo, hora] of entradas) {
      if (hora === horaActual) {
        this.horaDisparada = horaActual;
        this.sonando.set({ tipo, hora });
        this.tocarSonido();
        this.enviarNotificacion(tipo, hora);
        break;
      }
    }
  }

  private cargarHorarios(): Record<TipoComida, string> {
    const porDefecto: Record<TipoComida, string> = {
      desayuno: '08:30',
      comida: '14:00',
      cena: '19:30',
    };
    try {
      const guardado = localStorage.getItem(this.claveHorarios);
      return guardado ? { ...porDefecto, ...JSON.parse(guardado) } : porDefecto;
    } catch {
      return porDefecto;
    }
  }

  private cargarActivo(): boolean {
    try {
      const guardado = localStorage.getItem(this.claveActivo);
      return guardado ? guardado === 'true' : true;
    } catch {
      return true;
    }
  }

  private tocarSonido() {
    try {
      const AudioCtor = window.AudioContext;
      const audio = new AudioCtor();
      const notas = [523.25, 659.25, 783.99, 1046.5];
      notas.forEach((frecuencia, i) => {
        const oscilador = audio.createOscillator();
        const ganancia = audio.createGain();
        oscilador.type = 'sine';
        oscilador.frequency.value = frecuencia;
        const inicio = audio.currentTime + i * 0.45;
        ganancia.gain.setValueAtTime(0, inicio);
        ganancia.gain.linearRampToValueAtTime(0.6, inicio + 0.05);
        ganancia.gain.exponentialRampToValueAtTime(0.001, inicio + 0.4);
        oscilador.connect(ganancia);
        ganancia.connect(audio.destination);
        oscilador.start(inicio);
        oscilador.stop(inicio + 0.42);
      });
    } catch {
      /* auditorio no disponible */
    }
  }

  private enviarNotificacion(tipo: TipoComida, hora: string) {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') return;
    const titulos: Record<TipoComida, string> = {
      desayuno: 'Es hora del desayuno',
      comida: 'Es hora de la comida',
      cena: 'Es hora de la cena',
    };
    new Notification(titulos[tipo], {
      body: `Recuerda: primero verduras, luego proteina y al final los carbohidratos a la(s) ${hora}.`,
      icon: 'icons/icon-192x192.png',
    });
  }
}