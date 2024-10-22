import { Component, Input, forwardRef } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from "@angular/forms";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";

type inputType = "text" | "email" | "password" | "date";

@Component({
  selector: "app-input-layout",
  standalone: true,
  imports: [NgxMaskDirective, NgxMaskPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputLayoutComponent),
      multi: true,
    },
  ],
  templateUrl: "./input-layout.component.html",
  styleUrls: ["./input-layout.component.scss"],
})
export class InputLayoutComponent implements ControlValueAccessor {
  @Input() type: inputType = "text";
  @Input() placeholder: string = "";
  @Input() inputName: string = "";
  @Input() mask: string = "";
  @Input() formControl?: FormControl; // Adicionado para passar o FormControl diretamente

  value: string = "";
  isFocused: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  // Método para acessar o estado do controle
  get isDirty(): boolean {
    return this.formControl?.dirty || false;
  }
}
