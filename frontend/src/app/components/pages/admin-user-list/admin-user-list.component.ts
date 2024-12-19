import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.css']
})
export class AdminUserListComponent implements OnInit {
  public users: User[] = [];
  public loading = false;

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsersList();
  }

  // Get the list of users excluding the current admin
  getUsersList(): void {
    this.loading = true;
    const currentUserId = this.userService.currentUser.id;

    this.userService.getUsersList(currentUserId).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.toastrService.error(error, 'Failed to load users');
        this.loading = false;
      }
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.getUsersList();
        },
        error: (error) => {
          this.toastrService.error(error, 'Failed to delete user');
        }
      });
    }
  }
}
