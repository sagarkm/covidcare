import { Component, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppGlobals } from 'src/app/globals/app.global';
import { Hospitals, Entry } from 'src/app/models/hospitalmodel';
import { Hospital } from 'src/app/models/hospitaldatamodel';
import { IonContent } from '@ionic/angular';
import { LoadingService } from 'src/app/provider/loading.service';
import { ApiService } from 'src/app/provider/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  @ViewChild(IonContent) content: IonContent;
  
  dataArray: Hospital[] = [];
  searchArray: Hospital[] = [];
  isSearchOn: Boolean = false;

  constructor(
    public loadingProvider: LoadingService,
    public restProvider: ApiService, 
    private global: AppGlobals
  ) {}

  ionViewDidEnter() {
    this.loadingProvider.showLoader()
    this.restProvider
      .getData(this.global.HOSPITALS)
      .subscribe(
        (data: Hospitals) => {
          let entryArr: Entry[] = data.feed.entry; 
          let currentRow: number = 1; 
          let titleData = [];
          for (var val of entryArr) {
            if(Number(val.gs$cell.row) == currentRow) {
              titleData.push([val.title.$t, val.gs$cell.inputValue]);
            } else {
              this.dataArray.push(this.getHospital(titleData))
              currentRow += 1
              break;
            }
          }
          let rowData = []
          for (var val of entryArr) {
            if(Number(val.gs$cell.row) > 1 && currentRow == Number(val.gs$cell.row)) {
              rowData.push([val.title.$t, val.gs$cell.inputValue]);
            } else {
              if(Number(val.gs$cell.row) > 1) {
                this.dataArray.push(this.getHospital(rowData))
                rowData = []
                rowData.push([val.title.$t, val.gs$cell.inputValue]);
                currentRow += 1
              }
            }
          }
          this.dataArray.shift(); 
          this.loadingProvider.hideLoader()
          //console.log(this.dataArray)
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof ErrorEvent) {
            console.error('An error occurred:', err.error.message);
          } else {
            console.error(`Backend returned code "${err.status}", with status "${err.statusText}"`);
          }
        }
      );
   }

   openHospitalDetails(data: Hospital) {
    console.log(data)
   }

   getHospital(objArr: String[]): Hospital {
    var hospitalObj: Hospital = { serial: "", ward: "", service: "", hospital: "", address: "", pincode: "", latlong: "", beds: "", name: "", contact: "", email: ""}
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

   getSearchItems(event: any) {
    this.searchArray = this.dataArray
    let searchText = event.target.value;
    if (searchText && searchText.trim() !== '') {
        this.isSearchOn = true
        this.searchArray = this.searchArray.filter((item: Hospital) => {
        return (item.hospital.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      })
    } else {
      this.isSearchOn = false
      this.content.scrollToTop();
      this.searchArray = []
    }
  }
}
