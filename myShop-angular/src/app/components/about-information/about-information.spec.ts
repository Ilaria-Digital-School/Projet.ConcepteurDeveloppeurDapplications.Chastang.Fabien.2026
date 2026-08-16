import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutInformation } from './about-information';

describe('AboutInformation', () => {
  let component: AboutInformation;
  let fixture: ComponentFixture<AboutInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
