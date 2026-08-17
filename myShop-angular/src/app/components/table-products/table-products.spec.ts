import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProducts } from './table-products';

describe('TableProducts', () => {
  let component: TableProducts;
  let fixture: ComponentFixture<TableProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(TableProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
