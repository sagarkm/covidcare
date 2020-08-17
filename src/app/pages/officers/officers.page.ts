import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/provider/loading.service';
import { ApiService } from 'src/app/provider/api.service';
import { Officer } from 'src/app/models/officerdatamodel';
import { AlertService } from 'src/app/provider/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Entry, Officers } from 'src/app/models/officersmodel';
import { AppGlobals } from 'src/app/globals/app.global';
import { SHEET } from 'src/app/globals/app.enum';
import { ContactService } from 'src/app/provider/contact.service';

@Component({
  selector: 'app-officers',
  templateUrl: './officers.page.html',
  styleUrls: ['./officers.page.scss'],
})
export class OfficersPage implements OnInit {

  dataArray: Officer[] = []
  searchArray: Officer[] = []

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

  async getControlRoomData(event?: any) {
    if (!event) {
      await this.loadingProvider.showLoader()
    }
    this.dataArray = []
    this.restProvider
      .getData(AppGlobals.API_ENDPOINT(SHEET.OFFICERS))
      .subscribe(
        (data: Officers) => {
          let entryArr: Entry[] = data.feed.entry
          for (var entry of entryArr) {
            var officerObj: Officer = { serialNo: '', officer: '', respFor: '', emailId: '' }
            officerObj.serialNo = entry["gsx$sr.no."].$t
            officerObj.officer = entry.gsx$officer.$t
            officerObj.respFor = entry.gsx$responsiblefor.$t
            officerObj.emailId = entry.gsx$email.$t
            this.dataArray.push(officerObj)
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
      this.searchArray = this.searchArray.filter((item: Officer) => {
        return (item.officer.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        || item.respFor.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      })
    }
    this.loadingProvider.hideLoader()
  }

  openEmail(event: Event, data: Officer) {
    event.preventDefault()
    event.stopPropagation()
    if(data.emailId.length == 0) return
    this.contactProvider.sendEmail(data.officer, data.emailId)
  }

}
