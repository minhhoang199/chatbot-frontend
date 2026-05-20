import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChatNameDialogComponent } from './chat-name-dialog.component';

describe('ChatNameDialogComponent', () => {
  let component: ChatNameDialogComponent;
  let fixture: ComponentFixture<ChatNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatNameDialogComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
