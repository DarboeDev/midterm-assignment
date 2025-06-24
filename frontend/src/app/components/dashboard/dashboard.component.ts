// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private authSubscription: Subscription | undefined;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to currentUser updates from AuthService
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
      // If user logs out or session expires, redirect to auth page
      if (!user) {
        this.router.navigate(['/auth']);
      }
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
