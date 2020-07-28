import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/provider/alert.service';
import { NetworkService } from 'src/app/provider/network.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  
  constructor(
      private alert: AlertService, 
      private network: NetworkService,
    ) { }

  ngOnInit() {
    this.network.registerNetworkEvents()
  }

  ngOnDestroy() {
    this.network.closeNetworkEvents()
  }

  cityClicked() {
    this.alert.presentAlert('Currently we support only Mumbai !!')
  }

}
