import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OxygencylinderPage } from './oxygencylinder.page';

const routes: Routes = [
  {
    path: '',
    component: OxygencylinderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OxygencylinderPageRoutingModule {}
