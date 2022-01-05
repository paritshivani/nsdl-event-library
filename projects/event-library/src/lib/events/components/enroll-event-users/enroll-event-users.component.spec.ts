import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollEventUsersComponent } from './enroll-event-users.component';

describe('EnrollEventUsersComponent', () => {
  let component: EnrollEventUsersComponent;
  let fixture: ComponentFixture<EnrollEventUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollEventUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollEventUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
