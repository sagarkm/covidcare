import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppGlobals } from 'src/app/globals/app.global';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  @Input() updatedAt: string
  
  globals = AppGlobals

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  closeClicked() {
    this.modalController.dismiss()
  }

}
