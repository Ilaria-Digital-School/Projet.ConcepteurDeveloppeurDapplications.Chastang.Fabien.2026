import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePromotion } from './home-promotion';

describe('HomePromotion', () => {
  let component: HomePromotion;
  let fixture: ComponentFixture<HomePromotion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePromotion],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePromotion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
