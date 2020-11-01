import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Products } from "./product.model";


@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Products[] = [];
  private productsUpdated = new Subject<Products[]>();
  constructor(private _http: HttpClient, private router: Router) { }

  getProduct(): Observable<Products[]> {
    return this._http.get<Products[]>("https://karmazdrowia.pl:8080/api/products");
  }
  createProduct(bodyProduct) {
    return this._http.post<Products[]>("https://karmazdrowia.pl:8080/api/products", bodyProduct);
  }
  getProductID(id: string) {
    return this._http.get<Products>("https://karmazdrowia.pl:8080/api/products/" + id);
  }
  updateProduct(product) {
    return this._http.post("https://karmazdrowia.pl:8080/api/products/" + product._id, product);
  }
  deleteProduct(id) {
    return this._http.delete<Products[]>("https://karmazdrowia.pl:8080/api/products/" + id)
}

}