import { Component, computed, inject, signal } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { FoodCardComponent } from '../../componentes/food-card/food-card.component';
import { PlatoResumenComponent } from '../../componentes/plato-resumen/plato-resumen.component';
import { ModalAvisoComponent } from '../../componentes/modal-aviso/modal-aviso.component';
import { PlatoService } from '../../servicios/plato.service';
import { HistorialService } from '../../servicios/historial.service';
import { alimentos } from '../../datos/alimentos';
import { Alimento, Categoria, TipoComida } from '../../modelo/modelo';

interface Seccion {
  titulo: string;
  icono: string;
  nota: string;
  tipos: Categoria[];
}

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

      @if (platoServicio.seleccion().length > 0) {
        <button class="boton boton--secundario vaciar" (click)="platoServicio.limpiar()">
          <tabler-icon icon="x" [stroke]="2" />
          Vaciar plato
        </button>
      }

      <div class="buscador">
        <tabler-icon class="buscador-icono" icon="search" [stroke]="2" />
        <input
          type="search"
          inputmode="search"
          autocomplete="off"
          placeholder="Busca un alimento..."
          [value]="terminoBusqueda()"
          (input)="terminoBusqueda.set($any($event.target).value)"
        />
        @if (terminoBusqueda()) {
          <button
            class="buscador-borrar"
            (click)="terminoBusqueda.set('')"
            aria-label="Limpiar busqueda"
          >
            <tabler-icon icon="x" [stroke]="2.5" />
          </button>
        }
      </div>

      @if (buscando()) {
        @if (resultadosBusqueda().length === 0) {
          <div class="tarjeta sin-resultados">
            No encontre "{{ terminoBusqueda() }}". Prueba con otra palabra.
          </div>
        } @else {
          <div class="lista-alimentos">
            @for (alimento of resultadosBusqueda(); track alimento.id) {
              <app-food-card
                [alimento]="alimento"
                [seleccionado]="estaSeleccionado(alimento.id)"
                (tocar)="tocar(alimento)"
                (quitar)="platoServicio.quitar(alimento.id)"
              />
            }
          </div>
        }
      } @else {
        @for (seccion of secciones; track seccion.titulo) {
          <button
            class="encabezado-categoria"
            [attr.aria-expanded]="esEstaAbierta(seccion.titulo)"
            (click)="alternarSeccion(seccion.titulo)"
          >
            <tabler-icon [icon]="seccion.icono" [stroke]="1.5" />
            <span class="encabezado-texto">
              <span class="encabezado-titulo">{{ seccion.titulo }}</span>
              <span class="encabezado-cantidad"
                >{{ cantidadEn(seccion.tipos) }} alimentos</span
              >
            </span>
            @if (elegidosEn(seccion.tipos) > 0) {
              <span class="chip chip--verde elegidos">{{ elegidosEn(seccion.tipos) }} en tu plato</span>
            }
            <tabler-icon
              class="flecha"
              [class.abierta]="esEstaAbierta(seccion.titulo)"
              icon="chevron-right"
              [stroke]="2.5"
            />
          </button>
          @if (esEstaAbierta(seccion.titulo)) {
            <p class="nota-categoria">{{ seccion.nota }}</p>
            <div class="lista-alimentos">
              @for (alimento of alimentosDe(seccion.tipos); track alimento.id) {
                <app-food-card
                  [alimento]="alimento"
                  [seleccionado]="estaSeleccionado(alimento.id)"
                  (tocar)="tocar(alimento)"
                  (quitar)="platoServicio.quitar(alimento.id)"
                />
              }
            </div>
          }
        }
      }

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
    .vaciar {
      margin-bottom: 1rem;
    }
    .buscador {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      background: #ffffff;
      border: 2px solid #e5e1d8;
      border-radius: 999px;
      padding: 0.5rem 0.75rem 0.5rem 1rem;
      margin-bottom: 1.25rem;
    }
    .buscador:focus-within {
      border-color: #2e7d32;
    }
    .buscador-icono {
      color: #9e9e9e;
      flex-shrink: 0;
    }
    .buscador input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      font-family: inherit;
      color: #212121;
      background: transparent;
      min-height: 40px;
    }
    .buscador input::placeholder {
      color: #9e9e9e;
    }
    .buscador-borrar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      background: #eeeeee;
      color: #616161;
      cursor: pointer;
      flex-shrink: 0;
    }
    .encabezado-categoria {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      width: 100%;
      min-height: 56px;
      padding: 0.625rem 1rem;
      margin-top: 0.75rem;
      background: #ffffff;
      border: 2px solid #e5e1d8;
      border-radius: 14px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
    }
    .encabezado-categoria:active {
      transform: scale(0.99);
    }
    .encabezado-categoria > tabler-icon {
      color: #2e7d32;
      flex-shrink: 0;
    }
    .encabezado-texto {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-family: inherit;
    }
    .encabezado-titulo {
      font-size: 1.1rem;
      font-weight: 800;
      color: #212121;
    }
    .encabezado-cantidad {
      font-size: 0.8rem;
      font-weight: 600;
      color: #9e9e9e;
    }
    .elegidos {
      flex-shrink: 0;
    }
    .encabezado-categoria .flecha {
      color: #9e9e9e;
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }
    .encabezado-categoria .flecha.abierta {
      transform: rotate(90deg);
    }
    .nota-categoria {
      color: #757575;
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0.625rem 0 0.625rem;
      padding: 0 0.25rem;
    }
    .sin-resultados {
      font-size: 1.05rem;
      font-weight: 600;
      color: #5d5a52;
      text-align: center;
      padding: 2rem 1rem;
    }
    .lista-alimentos {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      margin-bottom: 0.25rem;
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

  readonly secciones: Seccion[] = [
    {
      titulo: 'Verduras (libres)',
      icono: 'leaf',
      nota: 'Come la cantidad que quieras.',
      tipos: ['verdura'],
    },
    {
      titulo: 'Proteinas',
      icono: 'egg',
      nota: 'Elige al menos una, con maximo 2 porciones.',
      tipos: ['proteina'],
    },
    {
      titulo: 'Carbohidratos y fruta',
      icono: 'bowl',
      nota: 'Arroz, tortilla, frijoles y fruta: maximo 1 punto en total.',
      tipos: ['carbohidrato-fuerte', 'carbohidrato-medio'],
    },
    {
      titulo: 'Grasas buenas',
      icono: 'avocado',
      nota: 'Aguacate y frutos secos en cantidades chicas.',
      tipos: ['grasa'],
    },
  ];

  readonly seccionAbierta = signal('Verduras (libres)');

  esEstaAbierta(titulo: string): boolean {
    return this.seccionAbierta() === titulo;
  }

  alternarSeccion(titulo: string) {
    this.seccionAbierta.set(this.seccionAbierta() === titulo ? '' : titulo);
  }

  cantidadEn(tipos: Categoria[]): number {
    return alimentos.filter((a) => tipos.includes(a.categoria)).length;
  }

  elegidosEn(tipos: Categoria[]): number {
    return this.platoServicio.seleccion().reduce(
      (total, e) => (tipos.includes(e.alimento.categoria) ? total + e.porciones : total),
      0,
    );
  }

  readonly terminoBusqueda = signal('');
  private readonly normaliza = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  private readonly terminoNormalizado = computed(() => this.normaliza(this.terminoBusqueda()).trim());
  readonly buscando = computed(() => this.terminoNormalizado().length > 0);
  readonly resultadosBusqueda = computed(() => {
    const termino = this.terminoNormalizado();
    if (!termino) return [];
    return alimentos.filter((a) => this.normaliza(a.nombre).includes(termino));
  });

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

  alimentosDe(tipos: Categoria[]) {
    return alimentos.filter((a) => tipos.includes(a.categoria));
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