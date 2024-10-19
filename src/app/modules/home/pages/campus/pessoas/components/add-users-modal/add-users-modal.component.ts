import { Component } from '@angular/core';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";

@Component({
  selector: 'app-add-users-modal',
  standalone: true,
  imports: [InputDefaultComponent, SelectInputComponent, ButtonComponent],
  templateUrl: './add-users-modal.component.html',
  styleUrl: './add-users-modal.component.scss'
})
export class AddUsersModalComponent {
  isLoading = false;

  onCloseModal() {
    console.log('Close modal');
  }
}
