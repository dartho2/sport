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
        return this._http.post("https://karmazdrowia.pl:8080/api/dish", bodyDish);
      }
      getDishID(id: string)  {
        return this._http.get<Dish>("https://karmazdrowia.pl:8080/api/dish/" + id);
      }
      updateDish(dish){
        return this._http.post("https://karmazdrowia.pl:8080/api/dish/" + dish._id, dish);

      }
      deleteDish(id) {
        return this._http.delete<Dish[]>("https://karmazdrowia.pl:8080/api/dish/" + id)
    }
}