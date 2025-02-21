import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIpComponent } from './manage-ip.component';

describe('ManageIpComponent', () => {
  let component: ManageIpComponent;
  let fixture: ComponentFixture<ManageIpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageIpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
