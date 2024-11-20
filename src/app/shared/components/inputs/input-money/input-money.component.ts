import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
} from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-money',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective, NgxMaskPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMoneyComponent),
      multi: true,
    },
  ],
  templateUrl: './input-money.component.html',
  styleUrls: ['./input-money.component.scss'],
})
export class InputMoneyComponent implements ControlValueAccessor {
  @Input() label: string = 'Preço';
  @Input() hasError: boolean = false;
  @Input() placeholder: string = 'Digite o preço';
  @Input() errorMsg: string = '';
  @Input() isDisable: boolean = false;
  @Input() variant: string = ''; 
  @Input() mask: string = 'separator.2'; // Máscara para valores monetários
  @Input() clearIfNotMatch: boolean | null = true;
  @Input() maxlength: number | null = 15; // Permitir mais dígitos

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