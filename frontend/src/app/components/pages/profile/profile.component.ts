import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user!: User;
  isSubmitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.userService.currentUser;

    this.profileForm = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      address: [this.user.address],
    });
  }

  get fc() {
    return this.profileForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    const updatedUser = {
      ...this.profileForm.value,
    };

    this.userService.updateUser(this.user.id, updatedUser).subscribe(
      (user) => {
        this.successMessage = 'Profile updated successfully!';
        this.userService.userSubject.next(user);
        this.router.navigate(['/profile']);
      },
      (error) => {
        this.errorMessage = 'Error updating profile!';
      }
    );
  }
}
