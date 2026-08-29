import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOrders } from './dashboard-orders';

describe('DashboardOrders', () => {
  let component: DashboardOrders;
  let fixture: ComponentFixture<DashboardOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
