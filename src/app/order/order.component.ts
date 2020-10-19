import { Component, OnInit } from '@angular/core';
import { ListOrderResp } from '../model/list-order-resp';
import { OrdersService } from '../services/orders.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  show: boolean = false;
  orders: ListOrderResp;
  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    this.ordersService.list().subscribe(data => {
      this.orders = data;
      this.show = true;
    });
  }

  cancelOrder(id: string) {
    console.log(id);
    Swal.fire({
      title: 'Do you want to cancel this order?',
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordersService.cancel(id).subscribe(resp => {
          Swal.fire('Order Cancelled!', '', 'success');
          this.ngOnInit();
        });
      }
    })
  }
}
