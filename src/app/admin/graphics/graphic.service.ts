import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Graphic } from "./graphic.model";


@Injectable({ providedIn: 'root' })
export class GraphicService {
    private products: Graphic[] = [];
    private productsUpdated = new Subject<Graphic[]>();
    constructor(private _http: HttpClient, private router: Router) { }

    getGraphic(): Observable<Graphic[]> {
        return this._http.get<Graphic[]>("https://karmazdrowia.pl:8080/api/graphics");
     }
      createGraphic(bodyGraphic) {
        return this._http.post<Graphic[]>("https://karmazdrowia.pl:8080/api/graphics", bodyGraphic);
      }
    //   getProductID(id: string) {
    //     return this._http.get<Product>("https://karmazdrowia.pl:8080/api/products/" + id);
    //   }
    updateGraphics(graphics) {
        return this._http.post("https://karmazdrowia.pl:8080/api/graphics/" + graphics._id, graphics);
      }
    //   deleteProduct(id) {
    //     return this._http.delete<Product[]>("https://karmazdrowia.pl:8080/api/products/" + id)
    // }

}