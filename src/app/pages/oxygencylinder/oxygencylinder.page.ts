import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/provider/loading.service';
import { ApiService } from 'src/app/provider/api.service';
import { AlertService } from 'src/app/provider/alert.service';
import { Cylinder } from 'src/app/models/oxygencylinderdatamodel';
import { HttpErrorResponse } from '@angular/common/http';
import { SHEET } from 'src/app/globals/app.enum';
import { OxygenCylinders, Entry } from 'src/app/models/oxygencylindermodel';
import { ContactService } from 'src/app/provider/contact.service';
import { AppGlobals } from 'src/app/globals/app.global';

@Component({
  selector: 'app-oxygencylinder',
  templateUrl: './oxygencylinder.page.html',
  styleUrls: ['./oxygencylinder.page.scss'],
})
export class OxygencylinderPage implements OnInit {

  globals = AppGlobals
  dataArray: Cylinder[] = []
  searchArray: Cylinder[] = []
  isLoading: boolean = false

  constructor(
    public loadingProvider: LoadingService,
    public restProvider: ApiService,
    public contactProvider: ContactService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.getCylinderData()
  }

  ngOnDestroy() {
    this.dataArray = []
    this.searchArray = []
  }

  async getCylinderData(event?: any) {
    if (!event) {
      this.isLoading = true
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
            this.isLoading = false
            this.loadingProvider.hideLoader()
          }
          //console.log(this.dataArray)
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
    this.getCylinderData(event)
  }

  async getSearchItems(event: any) {
    this.searchArray = this.dataArray
    let searchText = event.target.value
    if (searchText && searchText.trim() !== '') {
      this.searchArray = this.searchArray.filter((item: Cylinder) => {
        return (item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        || item.person.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      })
    }
  }

  openNumber(event: Event, data: Cylinder) {
    event.preventDefault()
    event.stopPropagation()
    if(data.contactNumber.length == 0) return
    this.contactProvider.callPhoneNumber(data.name, data.contactNumber.split(' ').join(''))
  } 

}
