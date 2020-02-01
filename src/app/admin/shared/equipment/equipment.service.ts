import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Equipment } from "./equipment.model";


@Injectable({ providedIn: 'root' })
export class EquipmentService {
    private products: Equipment[] = [];
    private productsUpdated = new Subject<Equipment[]>();
    constructor(private _http: HttpClient, private router: Router) { }

    getEquipment(): Observable<Equipment[]> {
        return this._http.get<Equipment[]>("https://karmazdrowia.pl:8080/api/equipments");
     }
    //   createProduct(bodyProduct) {
    //     return this._http.post<Product[]>("https://karmazdrowia.pl:8080/api/products", bodyProduct);
    //   }
    //   getProductID(id: string) {
    //     return this._http.get<Product>("https://karmazdrowia.pl:8080/api/products/" + id);
    //   }
    //   updateProduct(product) {
    //     return this._http.post("https://karmazdrowia.pl:8080/api/products/" + product._id, product);
    //   }
    //   deleteProduct(id) {
    //     return this._http.delete<Product[]>("https://karmazdrowia.pl:8080/api/products/" + id)
    // }

}