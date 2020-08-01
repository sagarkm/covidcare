import { Injectable } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { AppGlobals } from '../globals/app.global'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alerts: any[] = []

  constructor(public alertController: AlertController) { }

  async presentAlert(messageText: string) {
    this.hideEarlierMessages()
    const alert = await this.alertController.create({
      header: AppGlobals.ALERT_TITLE,
      message: messageText,
      buttons: ['OK']
    })
    this.alerts.push(alert)
    await alert.present()
  }

  async presentNonetworkAlert(status: boolean) {
    this.hideEarlierMessages()
    let messageText = status ? `<img src="/assets/img/network.png" class="card-alert">` : `<img src="/assets/img/no-network.png" class="card-alert">`
    const alert = await this.alertController.create({
      header: AppGlobals.ALERT_TITLE,
      message: messageText,
      buttons: ['OK']
    })
    this.alerts.push(alert)
    await alert.present()
  }

  async presentConfirmDialog(messageText: string) {
    return new Promise(async (resolve, reject) => {
      let alert = await this.alertController.create({
        header: AppGlobals.ALERT_TITLE,
        message: messageText,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              resolve(false)
            }
          } , {
            text: 'OK',
            handler: () => {
              resolve(true)
            }
          }
        ]
      })
      await alert.present()
    })
  }

  hideEarlierMessages() {
    if (this.alerts.length) {
      this.alerts.forEach(element => {
          element.dismiss()
      })
    }
    this.alerts = []
  }
}
