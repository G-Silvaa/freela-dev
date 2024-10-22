import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLayoutComponent } from './input-layout.component';

describe('InputLayoutComponent', () => {
  let component: InputLayoutComponent;
  let fixture: ComponentFixture<InputLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
