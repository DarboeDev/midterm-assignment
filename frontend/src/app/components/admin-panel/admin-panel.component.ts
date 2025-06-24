import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AuthService,
  User,
  RoleUpdateResponse,
} from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  users: User[] = [];
  selectedRoles: { [key: string]: string } = {}; // To hold selected roles for dropdowns
  message: string | null = null;
  messageType: 'success' | 'error' | '' = '';

  private destroy$ = new Subject<void>(); // Used for unsubscribing observables

  constructor(public authService: AuthService) {} // Make authService public for template access

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.authService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          // Initialize selectedRoles with current user roles
          this.users.forEach((user) => {
            const userId = this.getUserId(user);
            if (userId) {
              this.selectedRoles[userId] = user.role;
            }
          });
        },
        error: (err) => {
          this.showMessage(err.message || 'Failed to load users.', 'error');
        },
      });
  }
  trackByUserId(index: number, user: User): string {
    return this.getUserId(user) || index.toString(); // Use helper method
  }

  handleRoleChange(userId: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRoles[userId] = selectElement.value;
  }
  handleRoleChangeNew(user: User, newRole: string): void {
    const userId = this.getUserId(user);
    if (userId) {
      this.selectedRoles[userId] = newRole;
    }
  }

  updateUserRole(user: User): void {
    // Check if current user is admin
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || currentUser.role !== 'admin') {
      this.showMessage('Only administrators can update user roles.', 'error');
      return;
    }

    const userId = this.getUserId(user);
    if (!userId) {
      this.showMessage('Invalid user ID.', 'error');
      return;
    }
    const newRole = this.selectedRoles[userId];

    if (!newRole) {
      this.showMessage('Please select a role.', 'error');
      return;
    }

    this.authService
      .updateUserRole(userId, newRole)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.showMessage(
            response.message || 'User role updated successfully!',
            'success'
          );
          // Refresh the user list to show the updated role
          this.loadUsers();
        },
        error: (err) => {
          this.showMessage(err.message || 'Failed to update role.', 'error');
        },
      });
  } // Helper method to safely get user ID
  getUserId(user: User): string {
    return user._id || user.id || '';
  }

  // Helper method to get selected role for a user
  getSelectedRole(user: User): string {
    const userId = this.getUserId(user);
    return this.selectedRoles[userId] || user.role;
  }

  // Helper method to check if role update is disabled
  isUpdateDisabled(user: User): boolean {
    const userId = this.getUserId(user);
    return this.selectedRoles[userId] === user.role;
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    // Clear message after a few seconds
    setTimeout(() => {
      this.closeModal();
    }, 3000);
  }

  closeModal(): void {
    this.message = null;
    this.messageType = '';
  }
}
