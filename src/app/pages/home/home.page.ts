import { Component, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppGlobals } from 'src/app/globals/app.global';
import { Hospitals, Entry } from 'src/app/models/hospitalmodel';
import { Hospital } from 'src/app/models/hospitaldatamodel';
import { IonContent, ModalController, Platform } from '@ionic/angular';
import { LoadingService } from 'src/app/provider/loading.service';
import { ApiService } from 'src/app/provider/api.service';
import { AlertService } from 'src/app/provider/alert.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { FiltersPage } from '../filters/filters.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent) content: IonContent;

  dataArray: Hospital[] = [];
  searchArray: Hospital[] = [];
  filterArray: Hospital[] = [];
  filterItems: object[] = [];
  isFilterOn: boolean = false

  constructor(
    public loadingProvider: LoadingService,
    public restProvider: ApiService,
    private alert: AlertService,
    private global: AppGlobals,
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
    let searchText = event.target.value;
    await this.loadingProvider.showLoader();
    if (searchText && searchText.trim() !== '') {
      this.searchArray = this.searchArray.filter((item: Hospital) => {
        return (item.hospitalName.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      })
    }
    this.loadingProvider.hideLoader();
  }

  async getHospitalsData(event?: any) {
    if (!event) {
      await this.loadingProvider.showLoader()
    }
    this.dataArray = []
    this.restProvider
      .getData(this.global.HOSPITALS_FINAL)
      .subscribe(
        (data: Hospitals) => {
          let entryArr: Entry[] = data.feed.entry;
          for (var val of entryArr) {
            var hospitalObj: Hospital = { serialNo: "", ward: "", serviceType: "", hospitalName: "", category: "" ,address: "", pincode: "", latlong: "", noOfBeds: "", contactName: "", contactNumber: "", emailId: "" }
            hospitalObj.serialNo = val["gsx$sr.no."].$t
            hospitalObj.ward = val.gsx$ward.$t
            hospitalObj.serviceType = val.gsx$servicetype.$t
            hospitalObj.hospitalName = val.gsx$nameofhospital.$t
            hospitalObj.category = val.gsx$category.$t 
            hospitalObj.address = val.gsx$address.$t
            hospitalObj.pincode = val.gsx$pincode.$t
            hospitalObj.latlong = val.gsx$latlong.$t
            hospitalObj.noOfBeds = val["gsx$no.ofbeds"].$t
            hospitalObj.serviceType = val.gsx$servicetype.$t
            hospitalObj.contactName = val.gsx$contactname.$t
            hospitalObj.contactNumber = val.gsx$contactnumber.$t
            hospitalObj.emailId = val.gsx$emailid.$t
            this.dataArray.push(hospitalObj)
          }
          this.searchArray = this.dataArray;
          if (event) {
            event.target.complete();
          } else {
            this.loadingProvider.hideLoader()
          }
          //console.log(this.dataArray)
        },
        (err: HttpErrorResponse) => {
          if (event) {
            event.target.complete();
          } else {
            this.loadingProvider.hideLoader()
          }
          this.alert.presentAlert(err.error.message)

        }
      );
  }

  listRefresh(event: any) {
    this.getHospitalsData(event);
  }

  openNumber(event: Event, data: string) {
    event.preventDefault()
    event.stopPropagation()
    if(data.length == 0) return
    this.alert.presentConfirmDialog('Are you sure you want to call this number?').then((resp) => {
      if (resp) {
        if(this.platform.is("hybrid")) {
          this.callNumber.callNumber(data, false)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err));
        } else {
          window.open(`tel://${data}`)
        }
      }
    });
  } 

  openEmail(event: Event, data: string) {
    event.preventDefault()
    event.stopPropagation()
    if(data.length == 0) return
    this.alert.presentConfirmDialog('Are you sure you want to send the email?').then((resp) => {
      if (resp) {
        if(this.platform.is("hybrid")) {
          this.emailComposer.hasAccount().then((isValid: boolean) => {
            if (isValid) {
              let email = {
                to: data,
                subject: 'Covid Care',
                body: '',
                isHtml: true
              }
              this.emailComposer.open(email);
            }
          });
        } else {
          window.open(`mailto:${data}?subject=Covid%20Care`)
        }
      }
    });
  }

  openFilterScreen = async () => {

    const modal = await this.modalController.create({
      component: FiltersPage,
      componentProps: {
        hospitalList: this.dataArray,
        filterData: this.filterItems
      },
      showBackdrop: false
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.filterItems = data.filterData
      var hospitalArrayByWard: Hospital[]
      var hospitalArray: Hospital[]
      if (data.filterData.length > 0) {
        this.searchArray = []
        this.isFilterOn = true
        var ward = this.filterItems.filter(vendor => vendor['filterType'] === "ward")
        if(ward.length > 0) {
          hospitalArrayByWard = this.filterRecordsByType(ward, this.dataArray)
        }
        var service = this.filterItems.filter(vendor => vendor['filterType'] === "serviceType")
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
      let filteredData: Hospital[] = records.filter((hospitalItem: Hospital) => {
        return (hospitalItem[item['filterType']] === item['filterValue'])
      })
      filterArray.push(filteredData)
    })
    for (let data of filterArray) {
      hospitalArray = hospitalArray.concat(data)
    }
    return hospitalArray
  }
}
