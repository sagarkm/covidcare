import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Ambulances, Entry } from 'src/app/models/ambulancemodel';
import { AppGlobals } from 'src/app/globals/app.global';
import { SHEET } from 'src/app/globals/app.enum';
import { LoadingService } from 'src/app/provider/loading.service';
import { ApiService } from 'src/app/provider/api.service';
import { AlertService } from 'src/app/provider/alert.service';
import { Ambulance } from 'src/app/models/ambulancedatamodel';
import { ContactService } from 'src/app/provider/contact.service';

@Component({
  selector: 'app-ambulance',
  templateUrl: './ambulance.page.html',
  styleUrls: ['./ambulance.page.scss'],
})
export class AmbulancePage implements OnInit {

  globals = AppGlobals
  dataArray: Ambulance[] = []
  searchArray: Ambulance[] = []

  constructor(
    public loadingProvider: LoadingService,
    public restProvider: ApiService,
    public contactProvider: ContactService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.getAmbulanceData()
  }

  ngOnDestroy() {
    this.dataArray = []
    this.searchArray = []
  }

  openAmbulanceDetails(data) {
  }

  async getAmbulanceData(event?: any) {
    if (!event) {
      await this.loadingProvider.showLoader()
    }
    this.dataArray = []
    this.restProvider
      .getData(AppGlobals.API_ENDPOINT(SHEET.AMBULANCES))
      .subscribe(
        (data: Ambulances) => {
          let entryArr: Entry[] = data.feed.entry
          for (var entry of entryArr) {
            var ambulanceObj: Ambulance = { serialNo: '', name: '', person: '', contactNumber: '', address: '' }
            ambulanceObj.serialNo = entry["gsx$sr.no."].$t
            ambulanceObj.name = entry.gsx$ambulance.$t
            ambulanceObj.person = entry.gsx$person.$t
            ambulanceObj.address = entry.gsx$address.$t
            ambulanceObj.contactNumber = entry.gsx$contact.$t
            this.dataArray.push(ambulanceObj)
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
    this.getAmbulanceData(event)
  }

  async getSearchItems(event: any) {
    this.searchArray = this.dataArray
    let searchText = event.target.value
    if (searchText && searchText.trim() !== '') {
      this.searchArray = this.searchArray.filter((item: Ambulance) => {
        return (item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        || item.address.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      })
    }
  }

  openNumber(event: Event, data: Ambulance) {
    event.preventDefault()
    event.stopPropagation()
    if(data.contactNumber.length == 0) return
    let recipient = data.name ? data.name : data.person
    this.contactProvider.callPhoneNumber(recipient, data.contactNumber.split(' ').join(''))
  } 

}
