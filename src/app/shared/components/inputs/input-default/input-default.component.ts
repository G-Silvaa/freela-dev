import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective],
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
  @Input() mask: string = ''; 
  @Input() clearIfNotMatch: boolean | null = true;
  

  // Usando FormControl ao invés de value
  formControl: FormControl = new FormControl('');

  // ControlValueAccessor Methods
  writeValue(value: any): void {
    this.formControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.formControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.formControl.valueChanges.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  onInputChange(event: any) {
    this.formControl.setValue(event.target.value);
  }
}