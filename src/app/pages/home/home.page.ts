import { Component, ViewChild } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { AppGlobals } from 'src/app/globals/app.global'
import { Hospitals, Entry } from 'src/app/models/hospitalmodel'
import { Hospital } from 'src/app/models/hospitaldatamodel'
import { IonContent, ModalController, Platform } from '@ionic/angular'
import { LoadingService } from 'src/app/provider/loading.service'
import { ApiService } from 'src/app/provider/api.service'
import { AlertService } from 'src/app/provider/alert.service'
import { CallNumber } from '@ionic-native/call-number/ngx'
import { EmailComposer } from '@ionic-native/email-composer/ngx'
import { FiltersPage } from '../filters/filters.page'
import { PLATFORM_TYPE, FILTER_TYPE, FILTER, SHEET } from 'src/app/globals/app.enum'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent) content: IonContent

  dataArray: Hospital[] = []
  searchArray: Hospital[] = []
  filterArray: Hospital[] = []
  filterItems: object[] = []
  isFilterOn: boolean = false

  constructor(
    public loadingProvider: LoadingService,
    public restProvider: ApiService,
    private alert: AlertService,
    private callNumber: CallNumber,
    private emailComposer: EmailComposer,
    private modalController: ModalController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.getHospitalsData()
  }

  ngOnDestroy() {
    this.dataArray = []
    this.searchArray = []
  }

  openHospitalDetails(data: Hospital) {
    console.log(data)
  }

  async getSearchItems(event: any) {
    if(this.isFilterOn) {
      this.searchArray = this.filterArray
    } else {
      this.searchArray = this.dataArray
    }
    let searchText = event.target.value
    await this.loadingProvider.showLoader()
    if (searchText && searchText.trim() !== '') {
      this.searchArray = this.searchArray.filter((item: Hospital) => {
        return (item.hospitalName.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      })
    }
    this.loadingProvider.hideLoader()
  }

  async getHospitalsData(event?: any) {
    if (!event) {
      await this.loadingProvider.showLoader()
    }
    this.dataArray = []
    this.restProvider
      .getData(AppGlobals.API_ENDPOINT(SHEET.HOSPITALS))
      .subscribe(
        (data: Hospitals) => {
          let entryArr: Entry[] = data.feed.entry
          for (var entry of entryArr) {
            var hospitalObj: Hospital = { serialNo: '', ward: '', serviceType: '', hospitalName: '', category: '' ,address: '', pincode: '', latlong: '', noOfBeds: '', contactName: '', contactNumber: '', emailId: '' }
            hospitalObj.serialNo = entry['gsx$sr.no.'].$t
            hospitalObj.ward = entry.gsx$ward.$t
            hospitalObj.serviceType = entry.gsx$servicetype.$t
            hospitalObj.hospitalName = entry.gsx$nameofhospital.$t
            hospitalObj.category = entry.gsx$category.$t 
            hospitalObj.address = entry.gsx$address.$t
            hospitalObj.pincode = entry.gsx$pincode.$t
            hospitalObj.latlong = entry.gsx$latlong.$t
            hospitalObj.noOfBeds = entry['gsx$no.ofbeds'].$t
            hospitalObj.serviceType = entry.gsx$servicetype.$t
            hospitalObj.contactName = entry.gsx$contactname.$t
            hospitalObj.contactNumber = entry.gsx$contactnumber.$t
            hospitalObj.emailId = entry.gsx$emailid.$t
            this.dataArray.push(hospitalObj)
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
    this.getHospitalsData(event)
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

  openEmail(event: Event, data: string) {
    event.preventDefault()
    event.stopPropagation()
    if(data.length == 0) return
    this.alert.presentConfirmDialog(AppGlobals.ALERT_EMAIL).then((resp) => {
      if (resp) {
        if(this.platform.is(PLATFORM_TYPE.HYBRID)) {
          this.emailComposer.hasAccount().then((isValid: boolean) => {
            if (isValid) {
              let email = {
                to: data,
                subject: AppGlobals.ALERT_TITLE,
                body: '',
                isHtml: true
              }
              this.emailComposer.open(email)
            }
          })
        } else {
          window.open(AppGlobals.EMAIL_TO(data))
        }
      }
    })
  }

  openFilterScreen = async () => {
    const modal = await this.modalController.create({
      component: FiltersPage,
      componentProps: {
        hospitalList: this.dataArray,
        filterData: this.filterItems
      },
      showBackdrop: false
    })
    await modal.present()
    const { data } = await modal.onWillDismiss()
    if (data) {
      this.filterItems = data.filterData
      var hospitalArrayByWard: Hospital[]
      var hospitalArray: Hospital[]
      if (data.filterData.length > 0) {
        this.searchArray = []
        this.isFilterOn = true
        var ward = this.filterItems.filter(item => item[FILTER.FILTER_TYPE] === FILTER_TYPE.WARD)
        if(ward.length > 0) {
          hospitalArrayByWard = this.filterRecordsByType(ward, this.dataArray)
        }
        var service = this.filterItems.filter(item => item[FILTER.FILTER_TYPE] === FILTER_TYPE.SERVICE)
        if(service.length > 0) {
          hospitalArray = this.filterRecordsByType(service, hospitalArrayByWard ? hospitalArrayByWard : this.dataArray)
          this.filterArray = hospitalArray
          this.searchArray = hospitalArray
        } else {
          this.filterArray = hospitalArrayByWard
          this.searchArray = hospitalArrayByWard
        }
      } else {
        this.isFilterOn = false
        this.filterArray = []
        this.searchArray = this.dataArray
      }
    }
  }

  filterRecordsByType(items: any, records: Hospital[]): Hospital[] {
    var filterArray: Hospital[][] = []
    var hospitalArray: Hospital[] = []
    items.forEach((item) => {
      let filteredData: Hospital[] = records.filter(hospitalItem => hospitalItem[item[FILTER.FILTER_TYPE]] === item[FILTER.FILTER_VALUE])
      filterArray.push(filteredData)
    })
    for (let data of filterArray) {
      hospitalArray = hospitalArray.concat(data)
    }
    return hospitalArray
  }
}
