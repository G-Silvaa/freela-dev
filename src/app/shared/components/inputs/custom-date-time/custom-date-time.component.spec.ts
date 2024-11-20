import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateTimeComponent } from './custom-date-time.component';

describe('CustomDateTimeComponent', () => {
  let component: CustomDateTimeComponent;
  let fixture: ComponentFixture<CustomDateTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDateTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
