import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Dish } from "./dish.model";


@Injectable({ providedIn: 'root' })
export class DishServices {
    dishes: Dish[] = [];
    constructor(private _http: HttpClient, private router: Router) { }

    getDish(): Observable<Dish[]> {
        return this._http.get<Dish[]>("https://karmazdrowia.pl:8080/api/dish");
      }
      createDish(bodyDish) {
        console.log(bodyDish)
        return this._http.post<Dish[]>("https://karmazdrowia.pl:8080/api/dish", bodyDish);
      }
      // getProductID(id: string)  {
      //   return this._http.get<Dish>("https://karmazdrowia.pl:8080/api/products/" + id);
      // }
      updateDish(dish){
        return this._http.post("https://karmazdrowia.pl:8080/api/dish/" + dish._id, dish);

      }
}