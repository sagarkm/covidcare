import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(public alertController: AlertController) { }

  ngOnInit() {
  }

  cityClicked() {
    this.presentAlert()
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Notification',
      message: 'Currently we support only Mumbai!!',
      buttons: ['OK']
    });

    await alert.present();
  }


}
