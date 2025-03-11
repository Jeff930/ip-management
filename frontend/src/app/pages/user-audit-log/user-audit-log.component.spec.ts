import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuditLogComponent } from './user-audit-log.component';

describe('UserAuditLogComponent', () => {
  let component: UserAuditLogComponent;
  let fixture: ComponentFixture<UserAuditLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAuditLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAuditLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
