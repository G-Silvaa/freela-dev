import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'intra-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true,
    },
  ],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent {
  @Input() label: string = '';
  @Input() options: { value: string, label: string }[] = [];
  @Input() hasError: boolean = false;
  @Input() errorMsg: string = '';
  @Input() isDisable: boolean = false;
  @Input() placeholder: string = 'Selecione uma opção';

  @ViewChild('selectedValue', { static: false }) selectedValueRef!: ElementRef;

  value: any = ''; 
  isOpen: boolean = false;
  isFocused: boolean = false;
  focusedOptionIndex: number = -1;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {}

  ngOnInit() {}

  writeValue(value: any): void {
    this.value = value !== null ? value : ''; 
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

  toggleDropdown() {
    if (!this.isDisable) {
      this.isOpen = !this.isOpen;
      this.isFocused = this.isOpen;
      if (this.isOpen) {
        this.focusedOptionIndex = this.options.findIndex(option => option.value === this.value);
      }
    }
  }

  selectOption(option: { value: string, label: string }, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.value = option.value;
    this.onChange(this.value);
    this.onTouched();
    this.isOpen = false;
    this.isFocused = false;
  }

  clearSelection(event: Event) {
    event.stopPropagation();
    this.value = ''; 
    this.onChange(this.value);
    this.onTouched();
  }

  getSelectedLabel(): string {
    const selectedOption = this.options.find(option => option.value === this.value);
    return selectedOption ? selectedOption.label : this.placeholder;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.isOpen && this.focusedOptionIndex >= 0) {
        this.selectOption(this.options[this.focusedOptionIndex]);
      } else {
        this.toggleDropdown();
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.isOpen) {
        this.focusNextOption();
      } else {
        this.toggleDropdown();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.isOpen) {
        this.focusPreviousOption();
      }
    }
  }

  focusNextOption() {
    if (this.focusedOptionIndex < this.options.length - 1) {
      this.focusedOptionIndex++;
    } else {
      this.focusedOptionIndex = 0;
    }
    this.scrollToFocusedOption();
  }

  focusPreviousOption() {
    if (this.focusedOptionIndex > 0) {
      this.focusedOptionIndex--;
    } else {
      this.focusedOptionIndex = this.options.length - 1;
    }
    this.scrollToFocusedOption();
  }

  scrollToFocusedOption() {
    const dropdown = this.selectedValueRef.nativeElement.nextElementSibling;
    const focusedOption = dropdown.children[this.focusedOptionIndex];
    if (focusedOption) {
      focusedOption.scrollIntoView({ block: 'nearest' });
    }
  }

  onBlur() {
    setTimeout(() => {
      this.isFocused = false;
      this.isOpen = false;
    }, 200); 
  }

  onFocus() {
    this.isFocused = true;
  }
}