import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../service/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'Error occurred';

        if (error.error?.message) {
          message = error.error.message;
        } else if (error.status === 0) {
          message = 'Cannot connect to server.';
        } else if (error.status >= 500) {
          message = 'Server error (500).';
        }

        this.errorService.showError(message);
        return throwError(() => error);
      })
    );
  }
}