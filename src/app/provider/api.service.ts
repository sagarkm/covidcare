import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { retry, catchError, map } from 'rxjs/operators'
import { AppGlobals } from '../globals/app.global'
import { AlertService } from './alert.service'
import { Platform } from '@ionic/angular'
import { NetworkService } from './network.service'
import { PLATFORM_TYPE } from '../globals/app.enum'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient, 
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
    if (this.platform.is(PLATFORM_TYPE.HYBRID) && this.network.getNetworkStatus() == 'none') {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error({ error: { message: AppGlobals.NO_NETWORK } })
        }, 1000)
      })
    } else {
      return this.http
        .get<any>(endpointUrl)
        .pipe(
          retry(AppGlobals.RETRY_COUNT),
          catchError(err => {
            throw err
          })
        )
    }
  }

  // Post Data
  createItem(endpointUrl: string, data: any): Observable<any> {
    if (this.platform.is(PLATFORM_TYPE.HYBRID) && this.network.getNetworkStatus() == 'none') {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error({ error: { message: AppGlobals.NO_NETWORK } })
        }, 1000)
      })
    } else {
      return this.http
        .post<any>(endpointUrl, JSON.stringify(data), this.httpOptions)
        .pipe(
          map(res => {
            return res.json()
          }),
          retry(AppGlobals.RETRY_COUNT),
          catchError(err => {
            throw err
          })
        )
    }
  }
}
