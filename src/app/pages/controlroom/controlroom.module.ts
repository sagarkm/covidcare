import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlroomPageRoutingModule } from './controlroom-routing.module';

import { ControlroomPage } from './controlroom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlroomPageRoutingModule
  ],
  declarations: [ControlroomPage]
})
export class ControlroomPageModule {}
