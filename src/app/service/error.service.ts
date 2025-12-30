import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  errorMessage: string | null = null;

  showError(message: string) {
    console.error('ErrorService showError:', message);
    this.errorMessage = message;
  }

  clearError() {
    this.errorMessage = null;
  }
}