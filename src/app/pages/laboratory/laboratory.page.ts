import { Component, OnInit } from '@angular/core';
import { Entry, Labs } from 'src/app/models/laboratorymodel';
import { LoadingService } from 'src/app/provider/loading.service';
import { ApiService } from 'src/app/provider/api.service';
import { AlertService } from 'src/app/provider/alert.service';
import { AppGlobals } from 'src/app/globals/app.global';
import { HttpErrorResponse } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { PLATFORM_TYPE, SHEET } from 'src/app/globals/app.enum'
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Laboratory } from 'src/app/models/laboratorydatamodel';

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.page.html',
  styleUrls: ['./laboratory.page.scss'],
})
export class LaboratoryPage implements OnInit {

  dataArray: Laboratory[] = []
  searchArray: Laboratory[] = []

  constructor(
    public loadingProvider: LoadingService,
    public restProvider: ApiService,
    private alert: AlertService,
    private platform: Platform,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    this.getLaboratoryData()
  }

  ngOnDestroy() {
    this.dataArray = []
    this.searchArray = []
  }

  openLabDetails(data: Laboratory) {
    console.log(data)
  }

  async getLaboratoryData(event?: any) {
    if (!event) {
      await this.loadingProvider.showLoader()
    }
    this.dataArray = []
    this.restProvider
      .getData(AppGlobals.API_ENDPOINT(SHEET.LABS))
      .subscribe(
        (data: Labs) => {
          let entryArr: Entry[] = data.feed.entry
          for (var entry of entryArr) {
            var labObj: Laboratory = { serialNo: '', labName: '', address: '', zipcode: '', contactNumber: '' }
            labObj.serialNo = entry["gsx$sr.no."].$t
            labObj.labName = entry.gsx$laboratory.$t
            labObj.address = entry.gsx$address.$t
            labObj.zipcode = entry.gsx$zipcode.$t
            labObj.contactNumber = entry.gsx$contact.$t
            this.dataArray.push(labObj)
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
          debugger
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
    this.getLaboratoryData(event)
  }

  async getSearchItems(event: any) {
    this.searchArray = this.dataArray
    let searchText = event.target.value
    await this.loadingProvider.showLoader()
    if (searchText && searchText.trim() !== '') {
      this.searchArray = this.searchArray.filter((item: Laboratory) => {
        return (item.labName.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      })
    }
    this.loadingProvider.hideLoader()
  }

  openNumber(event: Event, data: string) {
    event.preventDefault()
    event.stopPropagation()
    if(data.length == 0) return
    this.alert.presentConfirmDialog(AppGlobals.ALERT_CALL).then((resp) => {
      if (resp) {
        if(this.platform.is(PLATFORM_TYPE.HYBRID)) {
          this.callNumber.callNumber(data, false)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err))
        } else {
          window.open(AppGlobals.TEL_TO(data))
        }
      }
    })
  } 

}
