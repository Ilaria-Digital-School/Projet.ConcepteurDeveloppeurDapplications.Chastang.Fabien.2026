import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemnantSale } from './remnant-sale';

describe('RemnantSale', () => {
  let component: RemnantSale;
  let fixture: ComponentFixture<RemnantSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemnantSale],
    }).compileComponents();

    fixture = TestBed.createComponent(RemnantSale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
