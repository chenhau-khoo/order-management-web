import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderCreateComponent } from './order-create/order-create.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';


const routes: Routes = [
  { path: 'order', component: OrderComponent },
  { path: 'order/add', component: OrderCreateComponent },
  { path: 'order/:id', component: OrderDetailsComponent },
  { path: '', component: OrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
