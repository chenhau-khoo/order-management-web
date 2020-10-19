import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import * as uuid from 'uuid';
import Swal from 'sweetalert2';

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
    private router: Router,
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
    this.ordersService.add(this.requestForm.value).subscribe(
      res => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('confirmed');
          }
          console.log(result);
        });
      });
  }

}
