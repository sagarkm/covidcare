import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProviderService } from 'src/app/provider/provider.service';
import { AppGlobals } from 'src/app/globals/app.global';
import { Hospitals, Feed, Entry, GsCell } from 'src/app/models/hospitalmodel';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dataArray: String[][] = [];

  constructor(public restProvider: ProviderService, private global: AppGlobals) {}

  ionViewDidEnter() {
    this.restProvider
      .getData(this.global.HOSPITALS)
      .subscribe(
        (data: Hospitals) => {
          let entryArr: Entry[] = data.feed.entry; 
          let currentRow: number = 1; 
          let titleData: String[] = [];
          for (var val of entryArr) {
            if(Number(val.gs$cell.row) == currentRow) {
              titleData.push(val.gs$cell.inputValue);
            } else {
              this.dataArray.push(titleData)
              currentRow += 1
              break;
            }
          }
          let rowData: String[] = []
          for (var val of entryArr) {
            if(Number(val.gs$cell.row) > 1 && currentRow == Number(val.gs$cell.row)) {
              rowData.push(val.gs$cell.inputValue);
            } else {
              if(Number(val.gs$cell.row) > 1) {
                this.dataArray.push(rowData)
                rowData = []
                rowData.push(val.gs$cell.inputValue);
                currentRow += 1
              }
            }
          }
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
}
