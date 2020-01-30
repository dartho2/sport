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

    // getGraphic(): Observable<Graphic[]> {
    //     return
    //     [{'date': '1.2020','items':[["dupa1",true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],["dupa2",false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true],["dupa3",false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],["dupa4",false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false]]},
    //     {'date': '12.2019','items':[["dupa12",true,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],["dupa2",false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true],["dupa3",false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],["dupa4",false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false]]}]
    // }
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