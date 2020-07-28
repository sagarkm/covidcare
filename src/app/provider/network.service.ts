import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  
  disconnectSubscription: any;
  connectSubscription: any;

  constructor(private network: Network, private alert: AlertService) { }

  registerNetworkEvents() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.alert.presentNonetworkAlert(false)
    });

    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.alert.presentNonetworkAlert(true)
    });
  }

  getNetworkStatus() : string  {
    return this.network.type
  }

  closeNetworkEvents() {
    this.disconnectSubscription.unsubscribe()
    this.connectSubscription.unsubscribe()
  }
}
