import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { AppGlobals } from '../globals/app.global';
import { Network } from '@ionic-native/network/ngx';
import { AlertService } from './alert.service';
import { Platform } from '@ionic/angular';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient, 
    private global: AppGlobals,
    private alert: AlertService,
    private network: NetworkService,
    public platform: Platform
    ) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  // Get Data
  getData(endpointUrl: string): Observable<any> {
    if (this.platform.is('hybrid') && this.network.getNetworkStatus() == 'none') {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error({ error: { message: 'Please check your network connection and try again.' } });
        }, 1000);
      });
    } else {
      return this.http
        .get<any>(endpointUrl)
        .pipe(
          retry(this.global.RETRY_COUNT),
          catchError(err => {
            throw err;
          })
        )
    }
  }

  // Post Data
  createItem(endpointUrl: string, data: any): Observable<any> {
    if (this.platform.is('hybrid') && this.network.getNetworkStatus() == 'none') {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error({ error: { message: 'Please check your network connection and try again.' } });
        }, 1000);
      });
    } else {
      return this.http
        .post<any>(endpointUrl, JSON.stringify(data), this.httpOptions)
        .pipe(
          map(res => {
            return res.json();
          }),
          retry(this.global.RETRY_COUNT),
          catchError(err => {
            throw err;
          })
        )
    }
  }
}
