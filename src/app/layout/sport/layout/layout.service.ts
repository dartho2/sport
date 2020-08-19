import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private _events: any;
  private _result: any;
  private _filter: any;
  private _lique: any;
  subject = new Subject();
  lique = new Subject();
  filter = new Subject();
  subject1 = new Subject();

  changeHeaderTitle(event: any, result:any) {
    this._events = event;
    this._result = result;
    this.subject.next(this._events)
    this.subject1.next(this._result);
  }
  changeGroup(event: any) {
    this._filter = event;
    this.filter.next(this._filter)
  }
  changeLique(id: any){
    this._lique = id;
    this.lique.next(this._lique)
  }

  clear() {
    this.lique.next(this._filter);
    this.filter.next(this._filter);
    this.subject.next(this._events);
    this.subject1.next(this._result);
  }
}