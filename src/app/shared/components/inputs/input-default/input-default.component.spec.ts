import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDefaultComponent } from './input-default.component';

describe('InputDefaultComponent', () => {
  let component: InputDefaultComponent;
  let fixture: ComponentFixture<InputDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDefaultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
