import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, GuardResult, MaybeAsync, Route, Router, UrlSegment} from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Observable, of } from 'rxjs';

const ROLE_ADMIN = 'ROLE_ADMIN';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    console.log('Can load method');
    let checkRole: boolean = this.authService.getRole() === ROLE_ADMIN;
    if(!checkRole) {
      this.router.navigate(['/sign-in']);
    }
    return of(checkRole);
  }

  canActivate(): Observable<boolean> {
    console.log('Can active method');
    if (this.authService.getToken().length > 0) {
      return of(true); // User is logged in, allow access
    } else {
      this.router.navigate(['/sign-in']);
      return of(false);
    }
  }
}