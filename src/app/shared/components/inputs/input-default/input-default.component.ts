import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDefaultComponent),
      multi: true,
    },
  ],
  templateUrl: './input-default.component.html',
  styleUrls: ['./input-default.component.scss'],
})
export class InputDefaultComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() hasError: boolean = false;
  @Input() placeholder: string = '';
  @Input() errorMsg: string = '';
  @Input() isDisable: boolean = false;
  @Input() variant: string = ''; 

  value: any;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
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