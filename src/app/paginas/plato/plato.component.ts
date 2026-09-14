import { Component, computed, inject, signal } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { FoodCardComponent } from '../../componentes/food-card/food-card.component';
import { PlatoResumenComponent } from '../../componentes/plato-resumen/plato-resumen.component';
import { ModalAvisoComponent } from '../../componentes/modal-aviso/modal-aviso.component';
import { PlatoService } from '../../servicios/plato.service';
import { HistorialService } from '../../servicios/historial.service';
import { alimentos } from '../../datos/alimentos';
import { Alimento, TipoComida } from '../../modelo/modelo';

@Component({
  selector: 'app-plato',
  imports: [TablerIconComponent, FoodCardComponent, PlatoResumenComponent, ModalAvisoComponent],
  template: `
    <div class="contenedor plato">
      <header>
        <h1 class="titulo-pagina">Crea tu plato</h1>
        <p class="subtitulo-pagina">
          Primero verduras, luego proteina y al final carbohidratos.
        </p>
      </header>

      <app-plato-resumen />

      <div class="barras-categorias">
        @for (categoria of categorias; track categoria.nombre) {
          <button
            class="pestana"
            [class.activo]="categoriaActiva() === categoria"
            (click)="categoriaActiva.set(categoria)"
          >
            {{ categoria.nombre }}
          </button>
        }
      </div>

      <div class="lista-alimentos">
        @for (alimento of alimentosFiltrados(); track alimento.id) {
          <app-food-card
            [alimento]="alimento"
            [seleccionado]="estaSeleccionado(alimento.id)"
            (tocar)="tocar(alimento)"
          />
        }
      </div>

      <div class="pie-plato">
        <button
          class="boton boton--primario boton-comer"
          [disabled]="!puedeCompletar"
          (click)="comer()"
        >
          <tabler-icon icon="check" [stroke]="2.5" />
          LO COMI
        </button>
      </div>
    </div>

    <app-modal-aviso
      [visible]="aviso.visible"
      [titulo]="aviso.titulo"
      [mensaje]="aviso.mensaje"
      [quiereNombre]="aviso.quiereNombre"
      [muestraCambiar]="aviso.muestraCambiar"
      (cerrar)="platoServicio.mantenerAviso()"
      (cambiar)="platoServicio.aceptarCambio()"
    />
  `,
  styles: `
    :host {
      display: block;
    }
    .barras-categorias {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding: 1rem 0 0.25rem;
    }
    .pestana {
      flex-shrink: 0;
      padding: 0.6rem 1rem;
      border-radius: 999px;
      border: 2px solid #e5e1d8;
      background: #ffffff;
      color: #5d5a52;
      font-size: 0.95rem;
      font-weight: 700;
      transition: all 0.2s ease;
    }
    .pestana.activo {
      background: #2e7d32;
      border-color: #2e7d32;
      color: #ffffff;
    }
    .lista-alimentos {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      margin: 1rem 0;
    }
    .pie-plato {
      position: sticky;
      bottom: calc(5.5rem + env(safe-area-inset-bottom, 0px));
      padding: 0.75rem 0 0.25rem;
      background: linear-gradient(to top, #faf7f1 70%, rgba(250, 247, 241, 0));
    }
  `,
})
export class PlatoComponent {
  readonly platoServicio = inject(PlatoService);
  private readonly historial = inject(HistorialService);

  readonly categorias = [
    { nombre: 'Verduras', tipos: ['verdura'] },
    { nombre: 'Proteinas', tipos: ['proteina'] },
    { nombre: 'Carbohidratos', tipos: ['carbohidrato-fuerte', 'carbohidrato-medio'] },
    { nombre: 'Grasas', tipos: ['grasa'] },
  ];

  readonly categoriaActiva = signal(this.categorias[0]);

  readonly alimentosFiltrados = computed(() =>
    alimentos.filter((a) => this.categoriaActiva().tipos.includes(a.categoria)),
  );

  get puedeCompletar() {
    return this.platoServicio.puedeCompletar();
  }

  get aviso() {
    const aviso = this.platoServicio.aviso();
    if (aviso) {
      return {
        visible: true,
        titulo: 'Limite de carbohidratos',
        mensaje: `Tu plato ya llego a 1 punto. Si eliges ${aviso.quiere.nombre} tendras que quitar ${aviso.reemplazaA.nombre}.`,
        quiereNombre: aviso.quiere.nombre,
        muestraCambiar: true,
      };
    }
    if (this.platoServicio.avisoTortillas()) {
      return {
        visible: true,
        titulo: 'Maximo 2 tortillas',
        mensaje: 'Puedes comer hasta 2 tortillas por comida para cuidar tu azucar.',
        quiereNombre: '',
        muestraCambiar: false,
      };
    }
    if (this.platoServicio.avisoPorcion()) {
      return {
        visible: true,
        titulo: 'Porcion maxima',
        mensaje: 'Ya tienes la cantidad recomendada de esta categoria en tu plato.',
        quiereNombre: '',
        muestraCambiar: false,
      };
    }
    return {
      visible: false,
      titulo: '',
      mensaje: '',
      quiereNombre: '',
      muestraCambiar: false,
    };
  }

  tocar(alimento: Alimento) {
    this.platoServicio.tocar(alimento);
  }

  estaSeleccionado(id: string): boolean {
    return this.platoServicio.seleccion().some((e) => e.alimento.id === id);
  }

  comer() {
    const tipo = this.tipoComidaAhora();
    const alimentosIds = this.platoServicio
      .seleccion()
      .flatMap((e) => Array.from({ length: e.porciones }, () => e.alimento.id));
    this.historial.agregar(tipo, alimentosIds);
    this.platoServicio.limpiar();
  }

  private tipoComidaAhora(): TipoComida {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 11) return 'desayuno';
    if (hora >= 11 && hora < 17) return 'comida';
    return 'cena';
  }
}