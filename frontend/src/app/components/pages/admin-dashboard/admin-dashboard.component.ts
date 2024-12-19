import {Component, inject, OnInit} from '@angular/core';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';
import { ToastrService } from 'ngx-toastr';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {
  foods: Food[] = [];
  selectedFood: Food | null = null;
  isEditMode = false;
  isDetailView = false;

  constructor(private router: Router,private foodService: FoodService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadFoods();
  }

  // Lấy danh sách sản phẩm
  loadFoods(): void {
    this.foodService.getAll().subscribe(
      (data) => {
        this.foods = data;
      },
      (error) => {
        this.toastr.error('Failed to load foods', 'Error');
      }
    );
  }

  // Mở chế độ thêm sản phẩm
  addFood(): void {
    this.selectedFood = {
      id: '',
      name: '',
      price: 0,
      tags: [],
      favorite: false,
      stars: 0,
      imageUrl: '',
      origins: [],
      cookTime: ''
    };
    this.isEditMode = false;  // Chế độ thêm
    // Chuyển hướng sang trang admin-products
    this.isDetailView = true; // Chuyển sang view thêm/sửa.
  }

  // Mở chế độ sửa sản phẩm
  editFood(food: Food): void {
    this.selectedFood = { ...food };
    this.isEditMode = true;
    this.isDetailView = true; // Chuyển sang view thêm/sửa.
  }

  // Lưu sản phẩm (thêm hoặc sửa)
  saveFood(): void {
    if (this.selectedFood) {
      if (this.isEditMode) {
        // Cập nhật sản phẩm
        this.foodService.updateFood(this.selectedFood.id, this.selectedFood).subscribe(
          (updatedFood) => {
            this.toastr.success('Watches updated successfully', 'Success');
            this.loadFoods();  // Tải lại danh sách sản phẩm
            this.selectedFood = null;
          },
          (error) => {
            this.toastr.error('Failed to update Watches', 'Error');
          }
        );
      } else {
        // Thêm mới sản phẩm
        this.foodService.addFood(this.selectedFood).subscribe(
          (newFood) => {
            this.toastr.success('Watches added successfully', 'Success');
            this.loadFoods();
            this.selectedFood = null;
          },
          (error) => {
            this.toastr.error('Failed to add Watches', 'Error');
          }
        );
      }
    }
    this.resetView(); // Quay lại view chính sau khi lưu.
  }

  // Xóa sản phẩm
  deleteFood(id: string): void {
    if (confirm('Are you sure you want to delete this Watches item?')) {
      this.foodService.deleteFood(id).subscribe(
        () => {
          this.toastr.success('Watches deleted successfully', 'Success');
          this.loadFoods();
        },
        (error) => {
          this.toastr.error('Failed to delete Watches', 'Error');
        }
      );
    }
  }

  resetView() {
    this.selectedFood = null;
    this.isDetailView = false; // Quay về view chính.
  }


}
