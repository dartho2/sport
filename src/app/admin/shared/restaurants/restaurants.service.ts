import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Restaurant } from "./restaurant.model";


@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private products: Restaurant[] = [];
  private productsUpdated = new Subject<Restaurant[]>();
  constructor(private _http: HttpClient, private router: Router) { }
  //POS
  getPosRestaurant(): Observable<Restaurant[]> {
    return this._http.get<Restaurant[]>("https://karmazdrowia.pl:8080/api/pos/restaurant");
  }
  getPosRestaurantId(id): Observable<Restaurant[]> {
    return this._http.get<Restaurant[]>("https://karmazdrowia.pl:8080/api/pos/restaurant/" + id);
  }
  //POS
  getRestaurant(): Observable<Restaurant[]> {
    return this._http.get<Restaurant[]>("https://karmazdrowia.pl:8080/api/restaurants");
  }
  createRestaurant(bodyRestaurant, id) {
    return this._http.post<Restaurant[]>("https://karmazdrowia.pl:8080/api/restaurants", bodyRestaurant);
  }
  updateRestaurantId(bodyRestaurant, id) {
    return this._http.post<Restaurant[]>("https://karmazdrowia.pl:8080/api/restaurants/" + id, bodyRestaurant);
  }
  getRestaurantID(id: string) {
    return this._http.get<Restaurant>("https://karmazdrowia.pl:8080/api/restaurants/" + id);
  }
  updateRestaurant(restaurants) {
    return this._http.post("https://karmazdrowia.pl:8080/api/restaurants/" + restaurants._id, restaurants);
  }
  deleteRestaurant(id) {
    return this._http.delete<Restaurant[]>("https://karmazdrowia.pl:8080/api/restaurants/" + id)
  }

}