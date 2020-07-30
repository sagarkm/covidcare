
import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
  readonly HOSPITALS: string = 'https://spreadsheets.google.com/feeds/cells/1TLumhvGZ9wBPUV0VMReP9SelAtQyk8PnbLAJrjrhWZw/1/public/full?alt=json'
  readonly HOSPITALS_FINAL: string = 'https://spreadsheets.google.com/feeds/list/1TeqomeWJrgGnS9zfc1eZaA3EpHPvnZUcLlEZdFdmbxc/1/public/full?alt=json'
  readonly RETRY_COUNT: number = 2;    
}

