import { Injectable } from '@angular/core'
import { Network } from '@ionic-native/network/ngx'
import { AlertService } from './alert.service'

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  
  lastnetworkType: boolean = true
  disconnectSubscription: any
  connectSubscription: any

  constructor(private network: Network, private alert: AlertService) { }
    
  registerNetworkEvents() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      if(this.lastnetworkType == true) {
        this.lastnetworkType = false
        this.alert.presentNonetworkAlert(false)
      }
    })

    this.connectSubscription = this.network.onConnect().subscribe(() => {
      if(this.lastnetworkType == false) {
        this.lastnetworkType = true
        this.alert.presentNonetworkAlert(true)
      }
    })
  }

  getNetworkStatus() : string  {
    return this.network.type
  }

  closeNetworkEvents() {
    this.disconnectSubscription.unsubscribe()
    this.connectSubscription.unsubscribe()
  }
}
