import { Injectable, computed, signal } from '@angular/core';
import { RegistroComida, TipoComida } from '../modelo/modelo';
import { alimentosPorId } from '../datos/alimentos';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly clave = 'platosano-historial';

  registros = signal<RegistroComida[]>(this.cargar());

  registrosDeHoy = computed(() => {
    const hoy = this.fechaHoy();
    return this.registros().filter((r) => r.fecha === hoy);
  });

  agrupadosUltimosDias = computed(() => {
    const porDia = new Map<string, RegistroComida[]>();
    for (const r of this.registros()) {
      const lista = porDia.get(r.fecha) ?? [];
      lista.push(r);
      porDia.set(r.fecha, lista);
    }
    return [...porDia.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);
  });

  agregar(tipo: TipoComida, nombresAlimentos: string[]) {
    const registro: RegistroComida = {
      fecha: this.fechaHoy(),
      tipo,
      hora: this.horaAhora(),
      alimentos: nombresAlimentos,
    };
    this.registros.update((lista) => [registro, ...lista]);
    this.guardar();
  }

  quitar(indiceGlobal: number) {
    this.registros.update((lista) => lista.filter((_, i) => i !== indiceGlobal));
    this.guardar();
  }

  nombreAlimento(id: string): string {
    const alimento = alimentosPorId(id);
    if (alimento) return alimento.nombre;
    const datos = id.split(':');
    return datos[datos.length - 1];
  }

  private fechaHoy(): string {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  private horaAhora(): string {
    const ahora = new Date();
    return `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
  }

  private cargar(): RegistroComida[] {
    try {
      const guardado = localStorage.getItem(this.clave);
      return guardado ? (JSON.parse(guardado) as RegistroComida[]) : [];
    } catch {
      return [];
    }
  }

  private guardar() {
    localStorage.setItem(this.clave, JSON.stringify(this.registros()));
  }
}