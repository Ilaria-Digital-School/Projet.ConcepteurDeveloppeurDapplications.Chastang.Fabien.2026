import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBenefits } from './about-benefits';

describe('AboutBenefits', () => {
  let component: AboutBenefits;
  let fixture: ComponentFixture<AboutBenefits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutBenefits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutBenefits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
