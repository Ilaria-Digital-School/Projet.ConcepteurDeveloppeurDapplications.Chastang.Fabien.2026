import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutIntroduction } from './about-introduction';

describe('AboutIntroduction', () => {
  let component: AboutIntroduction;
  let fixture: ComponentFixture<AboutIntroduction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutIntroduction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutIntroduction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
