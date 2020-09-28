import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Analystic } from "./analystic.model";
import { Event } from "./event.model";
import { Markets } from "./markets.model";

@Injectable({ providedIn: 'root' })
export class AnalysticService {
    analystic: Analystic[] = [];
    event: Event[] = [];
    markets:  any[];
    constructor(private _http: HttpClient, private router: Router) { }

    getAnalystict(data): Observable<Analystic[]> {
        return this._http.get<Analystic[]>("https://karmazdrowia.pl:8080/api/analystic/" + data);
      }
      getMatches(turnament, season){
        return this._http.get<any>('https://karmazdrowia.pl:8080/api/standings/' + turnament +'/'+ season)
      }
      getAnalystictEvent(data): Observable<any> {
        return this._http.get<any>("https://karmazdrowia.pl:8080/api/events/" + data);
      }
      getVotePrice(data): Observable<any> {
        return this._http.get<any>("https://api.sofascore.com/api/v1/event/"+ data + "/odds/1/all?");
      }
      addEvents(data): Observable<any> {
        return this._http.post<any>("https://karmazdrowia.pl:8080/api/bet", data );
      }
      getEventsLast(id){
        return this._http.get("https://api.sofascore.com/api/v1/team/" + id + "/events/last/0")
      }
      getEventsNext(id){
        return this._http.get("https://api.sofascore.com/api/v1/team/" + id + "/events/last/0")
      }
    }