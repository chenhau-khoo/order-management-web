import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CreateOrder } from '../model/create-order';
import { CreateOrderResp } from '../model/create-order-resp';
import { ListOrderResp } from '../model/list-order-resp';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private orderApiUrl: string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {
    this.orderApiUrl = environment.order_api_url;
  }

  add(req: CreateOrder): Observable<CreateOrderResp> {
    return this.httpClient.post<CreateOrderResp>(this.orderApiUrl + '/orders', req)
      .pipe(catchError(this.errorHandler))
  }

  list(): Observable<ListOrderResp> {
    return this.httpClient.get<ListOrderResp>(this.orderApiUrl + '/orders')
      .pipe(catchError(this.errorHandler))
  }

  cancel(id: string) {
    return this.httpClient.delete(this.orderApiUrl + '/orders/' + id)
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
