import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProviderService } from 'src/app/provider/provider.service';
import { AppGlobals } from 'src/app/globals/app.global';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public restProvider: ProviderService, private global: AppGlobals) {}

  ionViewDidEnter() {
    this.restProvider
      .getData(this.global.SAMPLE_ENDPOINT)
      .subscribe(
        (data: any) => {    
          console.log(data);
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
