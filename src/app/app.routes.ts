import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () => import('./paginas/inicio/inicio.component').then((m) => m.InicioComponent),
  },
  {
    path: 'plato',
    title: 'Creador de Plato',
    loadComponent: () => import('./paginas/plato/plato.component').then((m) => m.PlatoComponent),
  },
  {
    path: 'guia',
    title: 'Guia Rapida',
    loadComponent: () => import('./paginas/guia/guia.component').then((m) => m.GuiaComponent),
  },
  {
    path: 'ejercicio',
    title: 'Ejercicio',
    loadComponent: () =>
      import('./paginas/ejercicio/ejercicio.component').then((m) => m.EjercicioComponent),
  },
  {
    path: 'timers',
    title: 'Horario de Comidas',
    loadComponent: () =>
      import('./paginas/timers/timers.component').then((m) => m.TimersComponent),
  },
  {
    path: 'salud',
    title: 'Mi Salud',
    loadComponent: () => import('./paginas/salud/salud.component').then((m) => m.SaludComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];