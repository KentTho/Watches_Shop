import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthGuardD } from './auth.guard';
import { AuthUserGuard } from './authUser.guard';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { FoodPageComponent } from './components/pages/food-page/food-page.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { AdminUserListComponent } from './components/pages/admin-user-list/admin-user-list.component';
import { AdminOrderListComponent } from './components/pages/admin-order-list/admin-order-list.component';
import { OrderPageComponent } from './components/pages/order-page/order-page.component';
import { OrderDetailPageComponent } from './components/pages/order-detail-page/order-detail-page.component';
import { OrderTrackPageComponent } from './components/pages/order-track-page/order-track-page.component';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import {FoodComponent} from "./components/pages/food/food.component";
import {HeaderComponent} from "./components/partials/header/header.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminDashboardComponent,canActivate: [AuthGuardD]},
  { path: 'admin-user', component: AdminUserListComponent,canActivate: [AuthGuardD]},
  { path: 'admin-order', component: AdminOrderListComponent,canActivate: [AuthGuardD]},
  { path: 'search/', component: HeaderComponent,},
  { path: 'search/:searchTerm', component: FoodComponent,},
  { path: 'search/:searchTerm', component: HomeComponent,},
  { path: 'tag/:tag', component: FoodComponent },
  {path:'food/:id', component:FoodPageComponent},
  {path:'cart-page', component: CartPageComponent,canActivate: [AuthUserGuard]},
  {path:'login', component: LoginPageComponent},
  {path:'profile', component: ProfileComponent},
  {path:'orders', component: OrderPageComponent,canActivate: [AuthUserGuard]},
  {path:'order-detail/:id', component: OrderDetailPageComponent,canActivate: [AuthUserGuard]},
  {path:'register', component: RegisterPageComponent},
  {path:'checkout', component: CheckoutPageComponent, canActivate:[AuthUserGuard]},
  {path:'payment', component: PaymentPageComponent, canActivate:[AuthGuard],},
  {path:'track/:orderId', component: OrderTrackPageComponent, canActivate:[AuthGuard]},
  {path: 'food', component: FoodComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
