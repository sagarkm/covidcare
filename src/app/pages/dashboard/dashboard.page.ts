import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/provider/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private alert: AlertService) { }

  ngOnInit() {
  }

  cityClicked() {
    this.alert.presentAlert('Currently we support only Mumbai!!')
  }

  


}
