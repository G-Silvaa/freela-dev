import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
} from '@angular/forms';

@Component({
  selector: 'app-custom-date-time-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDateTimePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './custom-date-time.component.html',
  styleUrls: ['./custom-date-time.component.scss'],
})
export class CustomDateTimePickerComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() hasError: boolean = false;
  @Input() placeholder: string = '';
  @Input() errorMsg: string = '';
  @Input() isDisable: boolean = false;

  value: string = '';
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisable = isDisabled;
  }

  onInputChange(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
    this.onTouched();
  }
}