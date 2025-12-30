import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRoomDialogComponent } from './group-room-dialog.component';

describe('GroupRoomDialogComponent', () => {
  let component: GroupRoomDialogComponent;
  let fixture: ComponentFixture<GroupRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupRoomDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
