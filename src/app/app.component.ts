import { Component } from '@angular/core'

import { Platform, AlertController } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { Location } from '@angular/common'
import { AppGlobals } from './globals/app.global'
import { PLATFORM_TYPE } from './globals/app.enum'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public alertController: AlertController,
    private _location: Location
  ) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
    })

    if(this.platform.is(PLATFORM_TYPE.ANDROID)) {
      this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
        if (this._location.isCurrentPathEqualTo('/dashboard')) {
          this.showAndroidExitConfirm()
          processNextHandler()
        } else {
          // Navigate to back page
          this._location.back()
        }
      })

      this.platform.backButton.subscribeWithPriority(5, () => {
        //Handler called to force close !
        this.alertController.getTop().then(r => {
          if (r) {
            navigator['app'].exitApp()
          }
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }

  showAndroidExitConfirm() {
    this.alertController.create({
      header: AppGlobals.ALERT_TITLE,
      message: AppGlobals.ALERT_CLOSE_APP,
      backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!')
        }
      }, {
        text: 'Exit',
        handler: () => {
          navigator['app'].exitApp()
        }
      }]
    })
      .then(alert => {
        alert.present()
      })
  }
}
