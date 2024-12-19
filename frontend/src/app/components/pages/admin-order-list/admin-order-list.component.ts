import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-order-list',
  templateUrl: './admin-order-list.component.html',
  styleUrls: ['./admin-order-list.component.css']
})
export class AdminOrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  // Load all orders
  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        this.toastr.error('Error fetching orders', 'Error');
      }
    });
  }

  updateStatus(orderId: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const statusValue = selectElement.value;

      this.orderService.updateOrderStatus(orderId, { status: statusValue }).subscribe({
        next: (updatedOrder) => {
          this.toastr.success('Order status updated successfully', 'Success');
          this.loadOrders();  // Reload orders after update
        },
        error: (err) => {
          this.toastr.error('Error updating order status', 'Error');
        }
      });
    }
  }

}
