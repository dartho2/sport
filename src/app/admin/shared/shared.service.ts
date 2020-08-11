import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'  // <- ADD THIS
})
export class SharedService {

  private message = new BehaviorSubject([]);
  sharedMessage = this.message.asObservable();

  constructor() { 
    this.message.next([{"dd":"dd"}])
  }


  
}