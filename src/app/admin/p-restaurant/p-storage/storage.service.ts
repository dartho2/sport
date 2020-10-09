import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Storage } from "./storage.model";


@Injectable({ providedIn: 'root' })
export class StorageService {
  private products;
  private productsUpdated = new Subject<Storage[]>();
  constructor(private _http: HttpClient, private router: Router) { }

  //POS
  getPosStorage(id): Observable<Storage[]> {
    return this._http.get<Storage[]>("https://karmazdrowia.pl:8080/api/pos/storage/" + id);
  }
  getPosStorageProduct(id): Observable<Storage[]> {
    return this._http.get<Storage[]>("https://karmazdrowia.pl:8080/api/pos/dishes/" + id);
  }
  getProductID(id) {
    return this._http.get("https://karmazdrowia.pl:8080/api/pos/products/" +id);
  }
  createStorageProduct(product: Storage) {
    return this._http.post("https://karmazdrowia.pl:8080/api/pos/products", product);
  }
  createStorageRecipe(storage: Storage) {
    return this._http.post("https://karmazdrowia.pl:8080/api/pos/storage", storage);
  }

  updateStorageProduct(product) {
    return this._http.post("https://karmazdrowia.pl:8080/api/pos/products/" + product._id, product);
  }
  createStorage(id, data) {
    return this._http.post("https://karmazdrowia.pl:8080/api/pos/storage/" + id, data);
  }
  deleteStorageProduct(id) {
    return this._http.delete<Storage[]>("https://karmazdrowia.pl:8080/api/pos/products/" + id)
  }
  //POS


}