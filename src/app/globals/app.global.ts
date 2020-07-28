
import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
  readonly HOSPITALS: string = 'https://spreadsheets.google.com/feeds/cells/1H4rWWuNeazimD714kVAi4E5x9loN1ZLtjKsPgtb-pcg/1/public/full?alt=json'
  readonly RETRY_COUNT: number = 2;    
}

