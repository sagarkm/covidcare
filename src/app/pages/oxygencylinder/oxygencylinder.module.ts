import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OxygencylinderPageRoutingModule } from './oxygencylinder-routing.module';

import { OxygencylinderPage } from './oxygencylinder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OxygencylinderPageRoutingModule
  ],
  declarations: [OxygencylinderPage]
})
export class OxygencylinderPageModule {}
