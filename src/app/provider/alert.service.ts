import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public alertController: AlertController) { }

  async presentAlert(messageText: string) {
    const alert = await this.alertController.create({
      header: 'Notification',
      message: messageText,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentNonetworkAlert(status: boolean) {
    let messageText = status ? `<img src="/assets/img/network.png" class="card-alert">` : `<img src="/assets/img/no-network.png" class="card-alert">`
    const alert = await this.alertController.create({
      header: 'Notification',
      message: messageText,
      buttons: ['OK']
    });

    await alert.present();
  }
}
