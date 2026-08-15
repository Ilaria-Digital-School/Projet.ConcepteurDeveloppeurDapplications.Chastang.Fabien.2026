import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHelp } from './form-help';

describe('FormHelp', () => {
  let component: FormHelp;
  let fixture: ComponentFixture<FormHelp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHelp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormHelp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
