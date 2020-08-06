import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/provider/loading.service';
import { ApiService } from 'src/app/provider/api.service';
import { AlertService } from 'src/app/provider/alert.service';
import { Platform } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AppGlobals } from 'src/app/globals/app.global';
import { SHEET, PLATFORM_TYPE } from 'src/app/globals/app.enum';
import { Room } from 'src/app/models/controlroomdatamodel';
import { ControlRooms, Entry } from 'src/app/models/controlroommodel';

@Component({
  selector: 'app-controlroom',
  templateUrl: './controlroom.page.html',
  styleUrls: ['./controlroom.page.scss'],
})
export class ControlroomPage implements OnInit {

  dataArray: Room[] = []
  searchArray: Room[] = []

  constructor(
    public loadingProvider: LoadingService,
    public restProvider: ApiService,
    private alert: AlertService,
    private platform: Platform,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    this.getControlRoomData()
  }

  ngOnDestroy() {
    this.dataArray = []
    this.searchArray = []
  }

  openLabDetails(data: Room) {
    console.log(data)
  }

  async getControlRoomData(event?: any) {
    if (!event) {
      await this.loadingProvider.showLoader()
    }
    this.dataArray = []
    this.restProvider
      .getData(AppGlobals.API_ENDPOINT(SHEET.ROOMS))
      .subscribe(
        (data: ControlRooms) => {
          let entryArr: Entry[] = data.feed.entry
          for (var entry of entryArr) {
            var roomObj: Room = { serialNo: '', ward: '', area: '', contactNumber: '' }
            roomObj.serialNo = entry["gsx$sr.no."].$t
            roomObj.ward = entry.gsx$ward.$t
            roomObj.area = entry.gsx$area.$t
            roomObj.contactNumber = entry.gsx$controlroomnumber.$t
            this.dataArray.push(roomObj)
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
    this.getControlRoomData(event)
  }

  async getSearchItems(event: any) {
    this.searchArray = this.dataArray
    let searchText = event.target.value
    await this.loadingProvider.showLoader()
    if (searchText && searchText.trim() !== '') {
      this.searchArray = this.searchArray.filter((item: Room) => {
        return (item.ward.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
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
