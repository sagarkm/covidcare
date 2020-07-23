
import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
  readonly HOSPITALS: string = 'https://spreadsheets.google.com/feeds/cells/1TLumhvGZ9wBPUV0VMReP9SelAtQyk8PnbLAJrjrhWZw/1/public/full?alt=json'
  readonly RETRY_COUNT: number = 2;    
}

