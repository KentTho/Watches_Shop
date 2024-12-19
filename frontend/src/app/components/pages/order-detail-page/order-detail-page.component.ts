import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-detail-page',
  templateUrl: './order-detail-page.component.html',
  styleUrls: ['./order-detail-page.component.css']
})
export class OrderDetailPageComponent implements OnInit {
  orderId!: string;
  orderDetail: any = {};
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;

    this.orderService.getOrderDetail(this.orderId).subscribe(
      (order) => {
        this.orderDetail = order;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load order details!' + this.orderId;
        this.isLoading = false;
      }
    );
  }
}
