import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLogin = true; // Toggle between login and register views
  fullName = '';
  email = '';
  password = '';
  role = 'viewer'; // Default role for registration
  message: string | null = null;
  messageType: 'success' | 'error' | '' = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // If user is already authenticated, redirect to dashboard
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  // Handle form submission (login or register)
  onSubmit(): void {
    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  // Login functionality
  login(): void {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.messageType = 'success';
          this.resetForm();
          setTimeout(() => this.router.navigate(['/dashboard']), 1500); // Redirect on success
        },
        error: (err) => {
          this.message = err.error.message || 'Login failed. Please try again.';
          this.messageType = 'error';
          this.clearMessageAfterDelay();
        },
      });
  }

  // Registration functionality
  register(): void {
    this.authService
      .register({
        fullName: this.fullName,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.messageType = 'success';
          this.resetForm();
          setTimeout(() => this.router.navigate(['/dashboard']), 1500); // Redirect on success
        },
        error: (err) => {
          this.message =
            err.error.message || 'Registration failed. Please try again.';
          this.messageType = 'error';
          this.clearMessageAfterDelay();
        },
      });
  }

  // Clear form fields
  resetForm(): void {
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.role = 'viewer'; // Reset to default role
  }

  // Toggle between login and registration forms
  toggleAuthMode(): void {
    this.isLogin = !this.isLogin;
    this.resetForm(); // Clear form when switching modes
    this.message = null; // Clear messages when switching modes
  }

  // Close the modal message
  closeModal(): void {
    this.message = null;
    this.messageType = '';
  }

  // Clear message automatically after a delay
  clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.message = null;
      this.messageType = '';
    }, 3000); // Message disappears after 3 seconds
  }
}
