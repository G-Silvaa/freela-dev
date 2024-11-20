import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { DataInputComponent } from './data-input.component';
import { By } from '@angular/platform-browser';

describe('DataInputComponent', () => {
  let component: DataInputComponent;
  let fixture: ComponentFixture<DataInputComponent>;
  let inputElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataInputComponent);
    component = fixture.componentInstance;
    inputElement = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should trigger onInputChange and call onChange with input value', () => {
    spyOn(component, 'onChange');
    inputElement.nativeElement.value = '15/05/2023';
    inputElement.nativeElement.dispatchEvent(new Event('change'));

    expect(component.onChange).toHaveBeenCalledWith('15/05/2023');
  });

  it('should set initial properties and defaults', () => {
    expect(component.label).toBe('');
    expect(component.placeholder).toBe('');
    expect(component.errorMsg).toBe('');
    expect(component.isDisable).toBe(false);
    expect(component.withTimepicker).toBe(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
