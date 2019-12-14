import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Analystic } from "./analystic.model";
import { Event } from "./event.model";

@Injectable({ providedIn: 'root' })
export class AnalysticService {
    analystic: Analystic[] = [];
    event: Event[] = [];
    constructor(private _http: HttpClient, private router: Router) { }

    getAnalystict(data): Observable<Analystic[]> {
        return this._http.get<Analystic[]>("https://karmazdrowia.pl:8080/api/analystic/" + data);
      }
      getAnalystictEvent(data): Observable<Event[]> {
        return this._http.get<Event[]>("https://karmazdrowia.pl:8080/api/events/" + data);
      }
}