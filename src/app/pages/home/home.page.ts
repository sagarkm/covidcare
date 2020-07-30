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

  getHospital(objArr: String[]): Hospital {
    var hospitalObj: Hospital = { serial: "", ward: "", service: "", hospital: "", address: "", pincode: "", latlong: "", beds: "", name: "", contact: "", email: "" }
    for (var val of objArr) {
      let key = val[0].charAt(0);
      switch (key) {
        case "A":
          hospitalObj.serial = val[1]
          break;
        case "B":
          hospitalObj.ward = val[1]
          break;
        case "C":
          hospitalObj.service = val[1]
          break;
        case "D":
          hospitalObj.hospital = val[1]
          break;
        case "E":
          hospitalObj.address = val[1]
          break;
        case "F":
          hospitalObj.pincode = val[1]
          break;
        case "G":
          hospitalObj.latlong = val[1]
          break;
        case "H":
          hospitalObj.beds = val[1]
          break;
        case "I":
          hospitalObj.name = val[1]
          break;
        case "J":
          hospitalObj.contact = val[1]
          break;
        case "K":
          hospitalObj.email = val[1]
          break;
        default:
          break;
      }
    }
    return hospitalObj
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
        return (item.hospital.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
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
      .getData(this.global.HOSPITALS)
      .subscribe(
        (data: Hospitals) => {
          let entryArr: Entry[] = data.feed.entry;
          let currentRow: number = 1;
          let titleData = [];
          for (var val of entryArr) {
            if (Number(val.gs$cell.row) == currentRow) {
              titleData.push([val.title.$t, val.gs$cell.inputValue]);
            } else {
              this.dataArray.push(this.getHospital(titleData))
              currentRow += 1
              break;
            }
          }
          let rowData = []
          for (var val of entryArr) {
            if (Number(val.gs$cell.row) > 1 && currentRow == Number(val.gs$cell.row)) {
              rowData.push([val.title.$t, val.gs$cell.inputValue]);
            } else {
              if (Number(val.gs$cell.row) > 1) {
                this.dataArray.push(this.getHospital(rowData))
                rowData = []
                rowData.push([val.title.$t, val.gs$cell.inputValue]);
                currentRow += 1
              }
            }
          }
          this.dataArray.shift();
          if (event) {
            event.target.complete();
          } else {
            this.loadingProvider.hideLoader()
          }
          this.searchArray = this.dataArray;
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
          window.open(`mailto://${data}?subject=Covid%20Care`)
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
        var service = this.filterItems.filter(vendor => vendor['filterType'] === "service")
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
