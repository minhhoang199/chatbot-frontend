import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from '../../service/message.service';
import { Message } from '../../model/message.model';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrl: './search-popup.component.css'
})
export class SearchPopupComponent {
  content: string = '';
  results: Message[] = [];
  loading = false;

  @Output() close = new EventEmitter<void>();
  @Output() clickMessage = new EventEmitter<Message>();
  @Input() roomId!: number; 

  constructor(private messageService: MessageService) {}

  onSearch() {
    if (!this.content.trim()) return;
    this.loading = true;
    this.messageService.searchByContent(this.roomId, this.content).subscribe({
      next: (res) => {
        this.results = res;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  closePopup() {
    this.close.emit();
  }

  scrollToMessage(message: Message) {
    this.clickMessage.emit(message);
  }
}
