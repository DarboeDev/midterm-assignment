import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

// User interface for type safety
export interface User {
  id?: string; // For auth responses (mapped from _id)
  _id?: string; // For direct MongoDB responses
  fullName: string;
  email: string;
  role: string;
  token?: string;
}

// Auth response interface
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Role update response interface
export interface RoleUpdateResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // Updated to match backend
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize currentUserSubject from localStorage (browser-safe)
    const storedUser = this.getFromStorage('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Browser-safe localStorage methods
  private setToStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  private getFromStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeFromStorage(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const currentUser = this.currentUserValue;
    console.log('Current user for auth headers:', currentUser); // Debug log

    if (currentUser && currentUser.token) {
      console.log('Adding auth header with token'); // Debug log
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser.token}`,
      });
    }
    console.log('No token found, using basic headers'); // Debug log
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }
  // --- Authentication methods ---
  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          // Store user details and JWT token in local storage to keep user logged in between page refreshes
          const userWithToken = { ...response.user, token: response.token };
          this.setToStorage('currentUser', JSON.stringify(userWithToken));
          this.currentUserSubject.next(userWithToken);
        }),
        catchError((error) => {
          console.error('Login failed', error);
          return throwError(
            () => new Error(error.error.message || 'Login failed')
          );
        })
      );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response) => {
          // Log in the user immediately after successful registration
          const userWithToken = { ...response.user, token: response.token };
          this.setToStorage('currentUser', JSON.stringify(userWithToken));
          this.currentUserSubject.next(userWithToken);
        }),
        catchError((error) => {
          console.error('Registration failed', error);
          return throwError(
            () => new Error(error.error.message || 'Registration failed')
          );
        })
      );
  }
  logout(): void {
    // Remove user from local storage to log user out
    this.removeFromStorage('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']); // Navigate to login page after logout
  }

  // --- User Management methods (for Admin Panel) ---
  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`http://localhost:5000/api/users`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch users', error);
          return throwError(
            () => new Error(error.error.message || 'Failed to fetch users')
          );
        })
      );
  }
  // Update a user's role
  updateUserRole(
    userId: string,
    newRole: string
  ): Observable<RoleUpdateResponse> {
    return this.http
      .put<RoleUpdateResponse>(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response) => {
          console.log('User role updated:', response);
          // If the updated user is the current logged-in user, update their session too
          if (
            this.currentUserValue &&
            this.currentUserValue.id === response.user.id
          ) {
            const updatedCurrentUser = {
              ...this.currentUserValue,
              role: response.user.role,
            };
            this.setToStorage(
              'currentUser',
              JSON.stringify(updatedCurrentUser)
            );
            this.currentUserSubject.next(updatedCurrentUser);
          }
        }),
        catchError((error) => {
          console.error('Failed to update user role', error);
          return throwError(
            () => new Error(error.error.message || 'Failed to update user role')
          );
        })
      );
  }
}
