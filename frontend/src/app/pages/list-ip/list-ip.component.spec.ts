import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIpComponent } from './list-ip.component';

describe('ListIpComponent', () => {
  let component: ListIpComponent;
  let fixture: ComponentFixture<ListIpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListIpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
