import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { GetOrderResp } from '../model/get-order-resp';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  show: boolean = false;
  order: GetOrderResp;
  orderId: string;
  displayForm: FormGroup;

  constructor(private ordersService: OrdersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.ordersService.get(this.orderId).subscribe((data: GetOrderResp) => {
      this.order = data;
      this.show = true;
    });
  }

}
