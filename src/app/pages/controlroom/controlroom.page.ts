import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/provider/loading.service';
import { ApiService } from 'src/app/provider/api.service';
import { AlertService } from 'src/app/provider/alert.service';
import { AppGlobals } from 'src/app/globals/app.global';
import { SHEET } from 'src/app/globals/app.enum';
import { Room } from 'src/app/models/controlroomdatamodel';
import { ControlRooms, Entry } from 'src/app/models/controlroommodel';
import { Areas } from 'src/app/models/areamodel';
import { Area } from 'src/app/models/areadatamodel';
import { ContactService } from 'src/app/provider/contact.service';

@Component({
  selector: 'app-controlroom',
  templateUrl: './controlroom.page.html',
  styleUrls: ['./controlroom.page.scss'],
})
export class ControlroomPage implements OnInit {

  globals = AppGlobals
  dataArray: Room[] = []
  searchArray: Room[] = []
  areaArray: Area[]
  isLoading: boolean = false

  constructor(
    public loadingProvider: LoadingService,
    public restProvider: ApiService,
    public contactProvider: ContactService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.getControlRoomData()
  }

  ngOnDestroy() {
    this.dataArray = []
    this.searchArray = []
  }

  openRoomDetails(data) {
  }

  getAreaData() {
    this.areaArray = []
    this.restProvider
      .getData(AppGlobals.API_ENDPOINT(SHEET.AREA))
      .subscribe(
        (data: Areas) => {
          let entryArr = data.feed.entry
          for (var entry of entryArr) {
            var areaObj: Area = { serialNo: '', ward: '', area: '' }
            areaObj.serialNo = entry["gsx$sr.no."].$t
            areaObj.ward = entry.gsx$ward.$t
            areaObj.area = entry.gsx$area.$t
            this.areaArray.push(areaObj)
          }
          for (var row of this.dataArray) {
            for (var area of this.areaArray) {
              if(row.ward == area.ward) {
                row.area = area.area
                row.ward = 'Ward ' + row.ward
              }
            }
          }
          this.searchArray = this.dataArray
        },
        (err: HttpErrorResponse) => {
          this.alert.presentAlert(err.error && err.error.message ? err.error.message : err.message)
        }
      )
  }

  async getControlRoomData(event?: any) {
    if (!event) {
      this.isLoading = true
      await this.loadingProvider.showLoader()
    }
    this.dataArray = []
    this.restProvider
      .getData(AppGlobals.API_ENDPOINT(SHEET.ROOMS))
      .subscribe(
        (data: ControlRooms) => {
          let entryArr: Entry[] = data.feed.entry
          for (var entry of entryArr) {
            var roomObj: Room = { serialNo: '', ward: '', area: '', misc: '', contactNumber: '' }
            roomObj.serialNo = entry["gsx$sr.no."].$t
            roomObj.ward = entry.gsx$ward.$t
            roomObj.contactNumber = entry.gsx$number.$t
            roomObj.misc = entry.gsx$misc.$t
            this.dataArray.push(roomObj)
          }
          this.searchArray = this.dataArray
          this.getAreaData()
          if (event) {
            event.target.complete()
          } else {
            this.isLoading = false
            this.loadingProvider.hideLoader()
          }
          //console.log(this.searchArray)
        },
        (err: HttpErrorResponse) => {
          if (event) {
            event.target.complete()
          } else {
            this.isLoading = false
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
    if (searchText && searchText.trim() !== '') {
      this.searchArray = this.searchArray.filter((item: Room) => {
        return (item.misc.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || item.ward.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || item.area.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      })
    }
  }

  openNumber(event: Event, data: Room) {
    event.preventDefault()
    event.stopPropagation()
    if(data.contactNumber.length == 0) return
    let recipient = data.area ? data.area : data.misc
    this.contactProvider.callPhoneNumber(recipient, data.contactNumber.split(' ').join(''))
  } 

}
