import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlroomPage } from './controlroom.page';

const routes: Routes = [
  {
    path: '',
    component: ControlroomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlroomPageRoutingModule {}
