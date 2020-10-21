import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { Order } from '../model/order';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  show: boolean = false;
  order: Order;
  orderId: string;
  displayForm: FormGroup;

  constructor(private ordersService: OrdersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.ordersService.findOrderById(this.orderId).subscribe((data: Order) => {
      this.order = data;
      this.show = true;
    });
  }

}
