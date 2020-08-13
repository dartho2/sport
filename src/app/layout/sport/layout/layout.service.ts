import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private _events: any;
  private _result: any;
  subject = new Subject();
  subject1 = new Subject();

  changeHeaderTitle(event: any, result:any) {
    this._events = event;
    this._result = result;
    this.subject.next(this._events)
    this.subject1.next(this._result);
  }

  clear() {
    this.subject.next(this._events);
    this.subject1.next(this._result);
  }
}