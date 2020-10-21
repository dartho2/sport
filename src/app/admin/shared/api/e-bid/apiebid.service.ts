import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
// import { Worker } from "./worker.model";


@Injectable({ providedIn: 'root' })
export class ApiEbidService {
    private products: Worker[] = [];
    private productsUpdated = new Subject<Worker[]>();
    constructor(private _http: HttpClient, private router: Router) { }

    getEBID(string): Observable<any[]> {
        return this._http.get<any[]>("https://api.e-bidfood.pl/api/v1/me/products?per_page=6&search=" + string);
    }



}