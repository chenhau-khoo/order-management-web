import { Component, OnInit } from '@angular/core';
import { ListOrderResp } from '../model/list-order-resp';
import { OrdersService } from '../services/orders.service';
import Swal from 'sweetalert2';
import { Order } from '../model/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  show: boolean = false;
  public orders: Order[];
  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.getAllOrders();
    // subscribe to orderCreated event
    this.ordersService.orderCreated$.subscribe(data => {
      if (data) {
        this.orders.push(data);
        this.orders.sort((a, b) => { return new Date(b.updatedOn).getTime() - new Date(a.updatedOn).getTime() });
      }
    });
    // subscribe to orderDeleted event
    this.ordersService.orderDeleted$.subscribe(data => {
      if (data) {
        const order: Order = this.orders.filter(o => o.id === data)[0];
        order.status = "CANCELLED";
      }
    })
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
}
