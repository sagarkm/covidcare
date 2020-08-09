import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/provider/loading.service';
import { ApiService } from 'src/app/provider/api.service';
import { AlertService } from 'src/app/provider/alert.service';
import { Platform } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Cylinder } from 'src/app/models/oxygencylinderdatamodel';
import { HttpErrorResponse } from '@angular/common/http';
import { PLATFORM_TYPE, SHEET } from 'src/app/globals/app.enum';
import { AppGlobals } from 'src/app/globals/app.global';
import { OxygenCylinders, Entry } from 'src/app/models/oxygencylindermodel';

@Component({
  selector: 'app-oxygencylinder',
  templateUrl: './oxygencylinder.page.html',
  styleUrls: ['./oxygencylinder.page.scss'],
})
export class OxygencylinderPage implements OnInit {

  dataArray: Cylinder[] = []
  searchArray: Cylinder[] = []

  constructor(
    public loadingProvider: LoadingService,
    public restProvider: ApiService,
    private alert: AlertService,
    private platform: Platform,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    this.getCylinderData()
  }

  ngOnDestroy() {
    this.dataArray = []
    this.searchArray = []
  }

  openLabDetails(data: Cylinder) {
    console.log(data)
  }

  async getCylinderData(event?: any) {
    if (!event) {
      await this.loadingProvider.showLoader()
    }
    this.dataArray = []
    this.restProvider
      .getData(AppGlobals.API_ENDPOINT(SHEET.CYLINDERS))
      .subscribe(
        (data: OxygenCylinders) => {
          let entryArr: Entry[] = data.feed.entry
          for (var entry of entryArr) {
            var cylinderObj: Cylinder = { serialNo: '', name: '', person: '', contactNumber: '' }
            cylinderObj.serialNo = entry["gsx$sr.no."].$t
            cylinderObj.name = entry.gsx$name.$t
            cylinderObj.person = entry.gsx$person.$t
            cylinderObj.contactNumber = entry.gsx$contact.$t
            this.dataArray.push(cylinderObj)
          }
          this.searchArray = this.dataArray
          if (event) {
            event.target.complete()
          } else {
            this.loadingProvider.hideLoader()
          }
          //console.log(this.dataArray)
        },
        (err: HttpErrorResponse) => {
          if (event) {
            event.target.complete()
          } else {
            this.loadingProvider.hideLoader()
          }
          this.alert.presentAlert(err.error && err.error.message ? err.error.message : err.message)
        }
      )
  }

  listRefresh(event: any) {
    this.getCylinderData(event)
  }

  async getSearchItems(event: any) {
    this.searchArray = this.dataArray
    let searchText = event.target.value
    await this.loadingProvider.showLoader()
    if (searchText && searchText.trim() !== '') {
      this.searchArray = this.searchArray.filter((item: Cylinder) => {
        return (item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      })
    }
    this.loadingProvider.hideLoader()
  }

  openNumber(event: Event, data: Cylinder) {
    event.preventDefault()
    event.stopPropagation()
    if(data.contactNumber.length == 0) return
    this.alert.presentConfirmDialog(AppGlobals.ALERT_CALL(data.name)).then((resp) => {
      if (resp) {
        if(this.platform.is(PLATFORM_TYPE.HYBRID)) {
          this.callNumber.callNumber(data.contactNumber, false)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err))
        } else {
          window.open(AppGlobals.TEL_TO(data.contactNumber))
        }
      }
    })
  } 

}
