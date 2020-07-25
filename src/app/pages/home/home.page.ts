import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProviderService } from 'src/app/provider/provider.service';
import { AppGlobals } from 'src/app/globals/app.global';
import { Hospitals, Feed, Entry, GsCell } from 'src/app/models/hospitalmodel';
import { Hospital } from 'src/app/models/hospitaldatamodel';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dataArray: Hospital[] = [];

  constructor(public restProvider: ProviderService, private global: AppGlobals) {}

  ionViewDidEnter() {
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
}
