import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  @Input() updatedAt: string

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  closeClicked() {
    this.modalController.dismiss()
  }

}
