import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrdersService } from '../services/orders.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {

  requestForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService) { }

  // convenience getter for easy access to form fields
  get f() { return this.requestForm.controls; }

  ngOnInit() {
    this.requestForm = this.fb.group({
      requestId: uuid.v4(),
      amount: ['', Validators.required],
      desc: ['', Validators.required]
    })
  }

  onSubmit(e) {
    e.preventDefault();
    this.submitted = true;
    if (this.requestForm.invalid) {
      return;
    }
    this.requestForm.value.requestId = uuid.v4();
    this.ordersService.addOrder(this.requestForm.value);
  }

}
