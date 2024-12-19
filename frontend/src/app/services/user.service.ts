import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { USER_LOGIN_URL, USER_REGISTER_URL,USER_UPDATE_URL,USER_LIST_URL,USER_DELETE_URL} from '../shared/constants/urls';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { Router } from '@angular/router';
import { User } from '../shared/models/User';

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userSubject =
    new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  constructor(private http:HttpClient, private toastrService:ToastrService, private router: Router) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser():User{
    return this.userSubject.value;
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Shop Watches ${user.name}!`,
            'Login Successful'
          );

          if (user.isAdmin === true) {
            this.router.navigateByUrl('/admin');
          } else {
            this.router.navigateByUrl(userLogin.returnUrl);
          }
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }

  register(userRegiser:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL, userRegiser).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Shop Watches ${user.name}`,
            'Register Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,
            'Register Failed')
        }
      })
    )
  }


  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    this.router.navigateByUrl('/login');
    // window.location.reload();
  }

  private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return new User();
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${USER_UPDATE_URL}${id}`, user).pipe(
      tap({
        next: (updatedUser) => {
          this.setUserToLocalStorage(updatedUser);
          this.userSubject.next(updatedUser);
          this.toastrService.success(
            `Your profile has been updated, ${updatedUser.name}`,
            'Update Successful'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error);
        }
      })
    );
  }

  getUsersList(currentUserId: string): Observable<User[]> {
    return this.http.get<User[]>(`${USER_LIST_URL}${currentUserId}`).pipe(
      tap({
        next: (users) => {
          this.toastrService.success(
            `List User`,
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Failed to load users');
        }
      })
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${USER_DELETE_URL}${id}`).pipe(
      tap({
        next: () => {
          this.toastrService.success('User deleted successfully!', 'Delete Successful');
          this.getUsersList(this.currentUser.id);
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Delete Failed');
        }
      })
    );
  }

}
