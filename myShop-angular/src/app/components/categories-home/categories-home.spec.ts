import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesHome } from './categories-home';

describe('CategoriesHome', () => {
  let component: CategoriesHome;
  let fixture: ComponentFixture<CategoriesHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesHome],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
