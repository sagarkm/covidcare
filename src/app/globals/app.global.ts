
import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
  readonly SAMPLE_ENDPOINT: string = 'https://jsonplaceholder.typicode.com/todos/1';
  readonly RETRY_COUNT: number = 2;    
}

