import {Component, OnInit} from '@angular/core';
import {Food} from "../../../shared/models/Food";
import {CartService} from "../../../services/cart.service";
import {FoodService} from "../../../services/food.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Tag} from "../../../shared/models/Tag";

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit{
  food!: Food;
  foods: Food[] = [];
  tags?:Tag[];
  constructor(private cartService: CartService,private foodService: FoodService, private activatedRoute: ActivatedRoute, private router: Router) {
    foodService.getAllTags().subscribe(serverTags => {
      this.tags = serverTags;
    });
    activatedRoute.params.subscribe((params) => {
      if (params.id) {
        foodService.getFoodById(params.id).subscribe(serverFood => {
          // Nếu có URL ảnh, thêm URL đầy đủ từ server Node.js
          if (serverFood.imageUrl) {
            serverFood.imageUrl = `http://localhost:5000/images/${serverFood.imageUrl}`;
          }
          this.food = serverFood;  // Gán dữ liệu vào food
        });
      }
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      let foodsObservable: Observable<Food[]>;

      if (params.searchTerm) {
        foodsObservable = this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
      } else if (params.tag) {
        foodsObservable = this.foodService.getAllFoodsByTag(params.tag);
      } else {
        foodsObservable = this.foodService.getAll();
      }

      foodsObservable.subscribe((serverFoods) => {
        this.foods = serverFoods.map(food => {
          if (food.imageUrl) {
            food.imageUrl = `http://localhost:5000/images/${food.imageUrl}`;
          }
          return food;
        });
      });



    });
  }
  addToCart() {
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }
}
