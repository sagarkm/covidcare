import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'filters',
    loadChildren: () => import('./pages/filters/filters.module').then( m => m.FiltersPageModule)
  },
  {
    path: 'laboratory',
    loadChildren: () => import('./pages/laboratory/laboratory.module').then( m => m.LaboratoryPageModule)
  },
  {
    path: 'ambulance',
    loadChildren: () => import('./pages/ambulance/ambulance.module').then( m => m.AmbulancePageModule)
  },
  {
    path: 'controlroom',
    loadChildren: () => import('./pages/controlroom/controlroom.module').then( m => m.ControlroomPageModule)
  },
  {
    path: 'oxygencylinder',
    loadChildren: () => import('./pages/oxygencylinder/oxygencylinder.module').then( m => m.OxygencylinderPageModule)
  },
  {
    path: 'officers',
    loadChildren: () => import('./pages/officers/officers.module').then( m => m.OfficersPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then( m => m.InfoPageModule)
  },
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
