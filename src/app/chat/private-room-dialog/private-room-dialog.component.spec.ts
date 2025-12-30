import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateRoomDialogComponent } from './private-room-dialog.component';

describe('PrivateRoomDialogComponent', () => {
  let component: PrivateRoomDialogComponent;
  let fixture: ComponentFixture<PrivateRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivateRoomDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivateRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
