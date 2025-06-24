import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const expectedRoles = route.data['roles'] as Array<string>;

    return this.authService.currentUser.pipe(
      take(1), // Take the current value and complete
      map((user) => {
        if (user && expectedRoles.includes(user.role)) {
          return true; // User has one of the required roles
        } else {
          // Redirect to a forbidden page or dashboard if unauthorized
          alert('Access Denied: You do not have the required permissions.'); // Use a proper modal in real app
          return this.router.createUrlTree(['/dashboard']); // Or '/forbidden'
        }
      })
    );
  }
}
