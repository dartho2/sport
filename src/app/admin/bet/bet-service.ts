import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Bet } from "./bet.model";

@Injectable({ providedIn: 'root' })
export class BetServiceComponent {
    bet: Bet[] = [];
    constructor(private _http: HttpClient, private router: Router) { }

    getBet(data): Observable<Bet[]> {
        return this._http.get<Bet[]>("https://karmazdrowia.pl:8080/api/bet/" + data);
      }
      getBetAll(): Observable<any> {
        return this._http.get<any>("https://karmazdrowia.pl:8080/api/bet/");
      }
      updateBet(data){
        return this._http.post("https://karmazdrowia.pl:8080/api/bet/" + data._id, data);

      }
    //   getVotePrice(data): Observable<any> {
    //     return this._http.get<any>("https://api.sofascore.com/api/v1/event/"+ data + "/odds/1/all?");
    //   }
    //   addEvents(data): Observable<any> {
    //     return this._http.post<any>("https://karmazdrowia.pl:8080/api/bet", data );
    //   }
}