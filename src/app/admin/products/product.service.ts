import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Product } from "./product.model";


@Injectable({ providedIn: 'root' })
export class ProductService {
    private products: Product[] = [];
    private productsUpdated = new Subject<Product[]>();
    constructor(private _http: HttpClient, private router: Router) { }

    getProduct(): Observable<Product[]> {
        return this._http.get<Product[]>("https://karmazdrowia.pl:8080/api/products");
      }
      createProduct(bodyProduct) {
        return this._http.post<Product[]>("https://karmazdrowia.pl:8080/api/products", bodyProduct);
      }
      getProductID(id: string)  {
        return this._http.get<Product>("https://karmazdrowia.pl:8080/api/products/" + id);
      }
      updateProduct(product){
        return this._http.post("https://karmazdrowia.pl:8080/api/products/" + product._id, product);

      }
     
}