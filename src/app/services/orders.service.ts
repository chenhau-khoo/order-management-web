import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, repeat } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CreateOrder } from '../model/create-order';
import { CreateOrderResp } from '../model/create-order-resp';
import { ListOrderResp } from '../model/list-order-resp';
import { Order } from '../model/order';
import Swal from 'sweetalert2';
import { AttrAst } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private orderApiUrl: string;
  private orderCreated = new BehaviorSubject<Order>(null);
  private orderDeleted = new BehaviorSubject<string>(null);

  orderCreated$ = this.orderCreated.asObservable();
  orderDeleted$ = this.orderDeleted.asObservable();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {
    this.orderApiUrl = environment.order_api_url;
  }

  addOrder = (req: CreateOrder) => {
    this.httpClient.post<Order>(this.orderApiUrl + '/orders', req)
      .pipe(catchError(this.errorHandler))
      .subscribe(
        data => this.orderCreated.next(data)
      );
  }

  cancelOrder(id: string) {
    return this.httpClient.delete(this.orderApiUrl + '/orders/' + id)
      .pipe(
        map(data => {
          this.orderDeleted.next(id);
          return data;
        }),
        catchError(this.errorHandler));
  }

  getOrder(id: string): Observable<Order> {
    return this.httpClient.get<Order>(this.orderApiUrl + '/orders/' + id)
      .pipe(catchError(this.errorHandler))
  }

  getAllOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.orderApiUrl + '/orders')
      .pipe(catchError(this.errorHandler))
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong! Please try again.'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('confirmed');
      }
    });
    return throwError(errorMessage);
  }
}
