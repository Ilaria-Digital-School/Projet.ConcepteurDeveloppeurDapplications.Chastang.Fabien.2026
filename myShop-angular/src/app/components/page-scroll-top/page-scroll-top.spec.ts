import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageScrollTop } from './page-scroll-top';

describe('PageScrollTop', () => {
  let component: PageScrollTop;
  let fixture: ComponentFixture<PageScrollTop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageScrollTop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageScrollTop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
