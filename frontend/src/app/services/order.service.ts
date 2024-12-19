import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDER_CREATE_URL, ORDER_NEW_FOR_CURRENT_USER_URL, ORDER_PAY_URL, ORDER_TRACK_URL,ORDER_LIST_URL ,ORDER_DETAIL_URL,ORDER_UPDATE_STATUS_URL,ORDER_ALL} from '../shared/constants/urls';
import { Order } from '../shared/models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient) { }

  create(order:Order){
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }

  getNewOrderForCurrentUser():Observable<Order>{
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL);
  }

  pay(order:Order):Observable<string>{
    return this.http.post<string>(ORDER_PAY_URL,order);
  }

  trackOrderById(id:number): Observable<Order>{
    return this.http.get<Order>(ORDER_TRACK_URL + id);
  }

  getOrdersForCurrentUser(): Observable<any> {
    return this.http.get<any>(ORDER_LIST_URL);
  }

  getOrderDetail(orderId: string): Observable<any> {
    return this.http.get<any>(`${ORDER_DETAIL_URL}/${orderId}`);
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(ORDER_ALL);
  }

  updateOrderStatus(orderId: string, statusData: { status: string }): Observable<any> {
    return this.http.put<any>(`${ORDER_UPDATE_STATUS_URL}/${orderId}`, statusData);
  }
}
