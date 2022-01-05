import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailedAttendanceComponent } from './user-detailed-attendance.component';

describe('UserDetailedAttendanceComponent', () => {
  let component: UserDetailedAttendanceComponent;
  let fixture: ComponentFixture<UserDetailedAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailedAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailedAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
