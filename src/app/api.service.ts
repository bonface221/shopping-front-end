import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { ShoppingItem } from './shopping-item';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRoot = 'http://localhost:8000/'
  
  constructor(private http: HttpClient) { }
  
  getShoppingItems():Observable<ShoppingItem[]> {
    return this.http.get<ShoppingItem[]>(this.apiRoot.concat('shopping-item/'))
  }
  createShoppingItems(name:string,quantity:number) {
    return this.http.post(
      this.apiRoot.concat('shopping-item/'),
      {name,quantity}
    )
  }
  deleteShoppingItem(id: number) {
    return this.http.delete(this.apiRoot.concat(`shopping-item/${id}/`))
  }
}
