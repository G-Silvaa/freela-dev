import { Component } from '@angular/core';
import { SelectInputComponent } from "../../../../../shared/components/inputs/select-input/select-input.component";
import { InputDefaultComponent } from "../../../../../shared/components/inputs/input-default/input-default.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [SelectInputComponent, InputDefaultComponent, ReactiveFormsModule],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss'
})
export class CursosComponent {
  selectOptions = [
    { value: 'dindin', label: 'dindin' },
    { value: 'bolacha', label: 'bolacha' },
    { value: 'biscoito', label: 'biscoito' }
  ];
}
