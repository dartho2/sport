import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Recipe } from "./recipe.model";
// import { PProductsListComponent } from "./p-products-list/p-products-list.component";


@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipesUpdated = new Subject<Recipe[]>();
  constructor(private _http: HttpClient, private router: Router) { }

  getRecipe(): Observable<Recipe[]> {
    return this._http.get<Recipe[]>("https://karmazdrowia.pl:8080/api/pos/recipe");
  }
  createRecipe(bodyProduct) {
    return this._http.post<Recipe[]>("https://karmazdrowia.pl:8080/api/pos/recipe", bodyProduct);
  }
//   getProductID(id: string) {
//     return this._http.get<Products>("https://karmazdrowia.pl:8080/api/products/" + id);
//   }
//   updateProduct(product) {
//     return this._http.post("https://karmazdrowia.pl:8080/api/products/" + product._id, product);
//   }
//   deleteProduct(id) {
//     return this._http.delete<Products[]>("https://karmazdrowia.pl:8080/api/products/" + id)
// }
// getProduct(): Observable<Products[]> {
//   return this._http.get<Products[]>("https://karmazdrowia.pl:8080/api/products");
// }
}