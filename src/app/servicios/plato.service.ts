import { Injectable, computed, signal } from '@angular/core';
import { Alimento, AlimentoEnPlato } from '../modelo/modelo';
import { maxPuntosCarbohidrato, maxTortillasComida } from '../datos/alimentos';

export interface AvisoCarbohidrato {
  quiere: Alimento;
  reemplazaA: Alimento;
}

@Injectable({ providedIn: 'root' })
export class PlatoService {
  private readonly seleccionId = 'platosano-seleccion';

  seleccion = signal<AlimentoEnPlato[]>(this.cargar());
  aviso = signal<AvisoCarbohidrato | null>(null);
  avisoTortillas = signal<boolean>(false);
  avisoPorcion = signal<boolean>(false);

  totalCarbos = computed(() =>
    this.seleccion().reduce((total, e) => total + e.alimento.carbs * e.porciones, 0),
  );

  conteoVerduras = computed(() =>
    this.seleccion().filter((e) => e.alimento.categoria === 'verdura').length,
  );

  porcionesProteinas = computed(() =>
    this.seleccion()
      .filter((e) => e.alimento.categoria === 'proteina')
      .reduce((total, e) => total + e.porciones, 0),
  );

  tieneProteina = computed(() => this.porcionesProteinas() > 0);
  tieneVerdura = computed(() => this.conteoVerduras() > 0);
  puedeCompletar = computed(() => this.tieneProteina() && this.tieneVerdura());

  platoResumen = computed(() => this.seleccion());

  private cargar(): AlimentoEnPlato[] {
    try {
      const guardado = localStorage.getItem(this.seleccionId);
      if (!guardado) return [];
      const datos = JSON.parse(guardado) as AlimentoEnPlato[];
      const mapa = new Map<string, AlimentoEnPlato>(datos.map((d) => [d.alimento.id, d]));
      return [...mapa.values()];
    } catch {
      return [];
    }
  }

  private guardar() {
    localStorage.setItem(this.seleccionId, JSON.stringify(this.seleccion()));
  }

  tocar(alimento: Alimento) {
    const actual = this.buscar(alimento.id);

    if (alimento.categoria === 'verdura' || alimento.categoria === 'grasa') {
      if (actual) {
        this.incrementar(alimento.id, 1);
      } else {
        this.agregar(alimento, 1);
      }
      return;
    }

    if (alimento.categoria === 'proteina') {
      if (actual && actual.porciones >= 2) {
        this.avisoPorcion.set(true);
        this.vibrar();
        return;
      }
      if (actual) {
        this.incrementar(alimento.id, 1);
      } else {
        this.agregar(alimento, 1);
      }
      return;
    }

    if (alimento.categoria === 'carbohidrato-fuerte' || alimento.categoria === 'carbohidrato-medio') {
      const agregarPorcion = actual ? 1 : 1;
      const puntosActuales = this.totalCarbos();
      const puntosNuevos = alimento.carbs;

      if (alimento.id === 'tortilla') {
        const tortillasActuales = actual?.porciones ?? 0;
        if (tortillasActuales >= maxTortillasComida) {
          this.avisoTortillas.set(true);
          this.vibrar();
          return;
        }
      }

      if (puntosActuales + puntosNuevos > maxPuntosCarbohidrato) {
        const conflicto = this.ultimoCarbohidrato();
        if (conflicto && conflicto.alimento.id !== alimento.id) {
          this.aviso.set({ quiere: alimento, reemplazaA: conflicto.alimento });
          this.vibrar();
          return;
        }
        const agregarPorcion2 = agregarPorcion;
        void agregarPorcion2;
        this.aviso.set({ quiere: alimento, reemplazaA: alimento });
        this.vibrar();
        return;
      }

      if (actual) {
        this.incrementar(alimento.id, 1);
      } else {
        this.agregar(alimento, 1);
      }
    }
  }

  mantenerAviso() {
    this.aviso.set(null);
    this.avisoTortillas.set(false);
    this.avisoPorcion.set(false);
  }

  aceptarCambio() {
    const informacion = this.aviso();
    if (informacion) {
      this.quitar(informacion.reemplazaA.id);
      const yaExiste = this.buscar(informacion.quiere.id);
      if (yaExiste) {
        this.incrementar(informacion.quiere.id, 1);
      } else {
        this.agregar(informacion.quiere, 1);
      }
    }
    this.mantenerAviso();
  }

  quitar(id: string) {
    this.seleccion.update((lista) => lista.filter((e) => e.alimento.id !== id));
    this.guardar();
  }

  cambiarPorcion(id: string, delta: number) {
    const actual = this.buscar(id);
    if (!actual) return;
    if (actual.alimento.categoria === 'carbohidrato-fuerte' || actual.alimento.categoria === 'carbohidrato-medio') {
      const nueva = actual.porciones + delta;
      const puntosNuevos = actual.alimento.carbs * nueva;
      if (puntosNuevos > maxPuntosCarbohidrato) {
        this.avisoPorcion.set(true);
        this.vibrar();
        return;
      }
      if (actual.alimento.id === 'tortilla' && nueva > maxTortillasComida) {
        this.avisoTortillas.set(true);
        this.vibrar();
        return;
      }
      if (nueva <= 0) {
        this.quitar(id);
        return;
      }
      actual.porciones = nueva;
    } else {
      const nueva = actual.porciones + delta;
      if (actual.alimento.categoria === 'proteina' && nueva > 2) {
        this.avisoPorcion.set(true);
        this.vibrar();
        return;
      }
      if (nueva <= 0) {
        this.quitar(id);
        return;
      }
      actual.porciones = nueva;
    }
    this.guardar();
  }

  limpiar() {
    this.seleccion.set([]);
    this.guardar();
  }

  vibrar() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }

  private buscar(id: string): AlimentoEnPlato | undefined {
    return this.seleccion().find((e) => e.alimento.id === id);
  }

  private ultimoCarbohidrato(): AlimentoEnPlato | undefined {
    const carbohidratos = this.seleccion().filter(
      (e) =>
        e.alimento.categoria === 'carbohidrato-fuerte' ||
        e.alimento.categoria === 'carbohidrato-medio',
    );
    return carbohidratos[carbohidratos.length - 1];
  }

  private incrementar(id: string, cantidad: number) {
    this.seleccion.update((lista) => {
      const encontrado = lista.find((e) => e.alimento.id === id);
      if (encontrado) {
        encontrado.porciones += cantidad;
      }
      return [...lista];
    });
    this.guardar();
  }

  private agregar(alimento: Alimento, porciones: number) {
    const existe = this.buscar(alimento.id);
    if (existe) {
      this.incrementar(alimento.id, porciones);
      return;
    }
    this.seleccion.update((lista) => [...lista, { alimento, porciones }]);
    this.guardar();
  }
}