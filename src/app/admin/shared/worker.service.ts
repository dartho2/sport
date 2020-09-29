import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Worker } from "./worker.model";


@Injectable({ providedIn: 'root' })
export class WorkerService {
    private products: Worker[] = [];
    private productsUpdated = new Subject<Worker[]>();
    constructor(private _http: HttpClient, private router: Router) { }

    getWorker(): Observable<Worker[]> {
        return this._http.get<Worker[]>("https://karmazdrowia.pl:8080/api/workers");
    }
    updateProduct(id, worker) {
        return this._http.post("https://karmazdrowia.pl:8080/api/workers/" + id, worker);
    }
    //POS
    getPosWorker(id): Observable<Worker[]> {
        return this._http.get<Worker[]>("https://karmazdrowia.pl:8080/api/pos/employee/" +id);
    }
    //POS
    

}