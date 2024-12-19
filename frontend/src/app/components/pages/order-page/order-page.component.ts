import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderService.getOrdersForCurrentUser().subscribe(
      (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load orders!';
        this.isLoading = false;
      }
    );
  }

  viewOrderDetail(orderId: string): void {
    this.router.navigate([`/order-detail/${orderId}`]);
  }
}
