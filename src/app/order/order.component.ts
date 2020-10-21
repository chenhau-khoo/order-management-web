import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import Swal from 'sweetalert2';
import { Order } from '../model/order';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  show: boolean = false;
  orders: Order[];

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.getAllOrders();
    // subscribe to orderCreated event
    this.ordersService.orderCreated$.subscribe(newOrder => {
      console.log('newOrder:' + JSON.stringify(newOrder));
      if (newOrder && this.orders) {
        this.orders.push(newOrder);
        if (newOrder.status === "CONFIRMED") {
          const checkStatusSubscription = interval(2000).subscribe(() => {
            console.log("checkStatusSubscriber");
            this.ordersService.findOrderById(newOrder.id).subscribe(res => {
              if (res.status !== "CONFIRMED") {
                this.ordersService.setOrderStatusChanged(res);
                checkStatusSubscription.unsubscribe();
              }
            });
          });
          // stop listening after 60 seconds
          setInterval(() => checkStatusSubscription.unsubscribe(), 60000);
        }
        this.orders.sort((a, b) => { return new Date(b.updatedOn).getTime() - new Date(a.updatedOn).getTime() });
      }
    });

    // subscribe to orderStatusChanged event
    this.ordersService.orderStatusChanged$.subscribe(updatedOrder => {
      console.log('updatedOrder:' + JSON.stringify(updatedOrder));
      if (updatedOrder) {
        const order: Order = this.orders.filter(o => o.id === updatedOrder.id)[0];
        order.status = updatedOrder.status;
      }
    });
  }

  getAllOrders() {
    this.ordersService.getAllOrders().subscribe((data: Order[]) => {
      this.orders = data;
      this.show = true;
    });
  }

  cancelOrder(id: string) {
    Swal.fire({
      title: 'Do you want to cancel this order?',
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordersService.cancelOrder(id).subscribe(resp => {
          Swal.fire('Order Cancelled!', '', 'success');
        });
      }
    })
  }

  ngOnDestroy() {
    console.log("destroy");
  }
}
