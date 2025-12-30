import { Component } from '@angular/core';
import { ErrorService } from '../../service/error.service';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrl: './error-popup.component.css'
})
export class ErrorPopupComponent {
  constructor(public errorService: ErrorService) {}

  closeError() {
    this.errorService.clearError();
  }
}
