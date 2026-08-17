import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOrders } from './table-orders';

describe('TableOrders', () => {
  let component: TableOrders;
  let fixture: ComponentFixture<TableOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(TableOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
