import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTooltip } from './form-tooltip';

describe('FormTooltip', () => {
  let component: FormTooltip;
  let fixture: ComponentFixture<FormTooltip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTooltip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTooltip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
