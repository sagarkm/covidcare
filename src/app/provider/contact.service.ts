import { Injectable } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AppGlobals } from '../globals/app.global';
import { AlertService } from './alert.service';
import { PLATFORM_TYPE } from '../globals/app.enum';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private emailComposer: EmailComposer,
    private callNumber: CallNumber,
    private alert: AlertService,
    private platform: Platform,
    public actionSheetController: ActionSheetController
  ) { }


  sendEmail(recipient: string, emailId: string) {
    this.alert.presentConfirmDialog(AppGlobals.ALERT_EMAIL(recipient)).then((resp) => {
      if (resp) {
        if(this.platform.is(PLATFORM_TYPE.HYBRID)) {
          this.emailComposer.hasAccount().then((isValid: boolean) => {
            if (isValid) {
              let email = {
                to: emailId,
                subject: AppGlobals.ALERT_TITLE,
                body: '',
                isHtml: true
              }
              this.emailComposer.open(email)
            }
          })
        } else {
          window.open(AppGlobals.EMAIL_TO(emailId))
        }
      }
    })
  }

  callPhoneNumber(recipient: string, contactNumber: string) {
    this.alert.presentConfirmDialog(AppGlobals.ALERT_CALL(recipient)).then((resp) => {
      if (resp) {
        if(contactNumber.includes(',')) {
          var numbers = contactNumber.split(',')
          this.callOptions(numbers)
        } else {
          if(this.platform.is(PLATFORM_TYPE.HYBRID)) {
            this.callNumber.callNumber(contactNumber, false)
              .then(res => console.log('Launched dialer!', res))
              .catch(err => console.log('Error launching dialer', err))
          } else {
            window.open(AppGlobals.TEL_TO(contactNumber))
          }
        }
      }
    })
  }

  displayMap(recipient: string, address: string) {
    this.alert.presentConfirmDialog(AppGlobals.ALERT_MAP(recipient)).then((resp) => {
      if (resp) {
        if(this.platform.is(PLATFORM_TYPE.IOS)) {
          window.open('maps://https://maps.google.com?q=' + address);
        } else {
          window.open('https://maps.google.com/maps?q=' + address);
        }
      }
    })
  }

  async callOptions(numbers: string[]) { 
    let opts = {
      header: "Call Options",
      buttons: this.createCallOptionsButtons(numbers),
    };
    const actionSheet = await this.actionSheetController.create(opts);
    await actionSheet.present();
  }

  createCallOptionsButtons(numArr: string[]){
    let buttons = []
    let options = []
    for (let number of numArr) {
      options.push( { text: number, icon: 'call', role: '' } )
    }
    options.push( { text: 'Cancel', icon: 'close', role: 'cancel' } )
    for (var i = 0; i < options.length; i++) {
      let opt = options[i];
      let button = {
        text: opt.text, 
        icon: opt.icon,
        role: opt.role,
        handler: async () => {
          if(button.text != 'Cancel') {
            if(this.platform.is(PLATFORM_TYPE.HYBRID)) {
              this.callNumber.callNumber(button.text, false)
                .then(res => console.log('Launched dialer!', res))
                .catch(err => console.log('Error launching dialer', err))
            } else {
              window.open(AppGlobals.TEL_TO(button.text))
            }
          }
        }
      }
      buttons.push(button);
    }
    return buttons;
  }

}
