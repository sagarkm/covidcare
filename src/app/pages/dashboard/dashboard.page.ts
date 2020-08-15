import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/provider/alert.service';
import { NetworkService } from 'src/app/provider/network.service';
import { AppGlobals } from 'src/app/globals/app.global';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  
  dashArray = [
    {route: '/controlroom', icon: 'assets/img/controlroom.png', title: 'Control Room'},
    {route: '/home', icon: 'assets/img/hospital.png', title: 'Hospitals'},
    {route: '/laboratory', icon: 'assets/img/laboratory.png', title: 'Laboratory'},
    {route: '/ambulance', icon: 'assets/img/ambulance.png', title: 'Ambulance'},
    {route: '/oxygencylinder', icon: 'assets/img/cylinder.png', title: 'Oxygen Cylinder'},
    {route: '/officers', icon: 'assets/img/policeman.png', title: 'Officers'}
  ]

  constructor(
      private alert: AlertService, 
      private network: NetworkService
  ) { }


  ngOnInit() {
    this.network.registerNetworkEvents()
  }

  ngOnDestroy() {
    this.network.closeNetworkEvents()
  }

  cityClicked() {
    this.alert.presentAlert(AppGlobals.CITY_SUPPORT)
  }

}
