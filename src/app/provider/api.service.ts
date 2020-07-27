import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { AppGlobals } from '../globals/app.global';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private global: AppGlobals) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Get Data
  getData(endpointUrl: string): Observable<any> {
    return this.http
      .get<any>(endpointUrl)
      .pipe(
        retry(this.global.RETRY_COUNT),
        catchError(err => {
          throw err;
        })
      )
  }

  // Post Data
  createItem(endpointUrl: string, data: any): Observable<any> {
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
