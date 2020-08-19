import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private _events: any;
  private _result: any;
  private _filter: any;
  subject = new Subject();
  filter = new Subject();
  subject1 = new Subject();

  changeHeaderTitle(event: any, result:any) {
    this._events = event;
    this._result = result;
    this.subject.next(this._events)
    this.subject1.next(this._result);
  }
  changeGroup(event: any) {
    console.log(event)
    this._filter = event;
    this.filter.next(this._filter)
  }

  clear() {
    this.filter.next(this._filter);
    this.subject.next(this._events);
    this.subject1.next(this._result);
  }
}