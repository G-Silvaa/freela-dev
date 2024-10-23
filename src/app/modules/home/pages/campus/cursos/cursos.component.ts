import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SelectInputComponent } from "../../../../../shared/components/inputs/select-input/select-input.component";
import { InputDefaultComponent } from "../../../../../shared/components/inputs/input-default/input-default.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { adicionarPessoasData, pessoasData, primeiroFiltro, segundoFiltro, terceiroFiltro } from '../pessoas/data/data';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AddUsersModalComponent } from "../pessoas/components/add-users-modal/add-users-modal.component";
import { TableComponent } from "../../../../../shared/components/table/table.component";



@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [SelectInputComponent, InputDefaultComponent, ReactiveFormsModule, AddUsersModalComponent, TableComponent],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss'
})
export class CursosComponent {
  cadatrarUsuario = true;
  pessoasData = pessoasData;
  adicionarPessoasData = adicionarPessoasData;
  primeiroFiltro = primeiroFiltro;
  segundoFiltro = segundoFiltro;
  terceiroFiltro = terceiroFiltro;
  isLoading = false;
  bsModalRef?: BsModalRef;

  @ViewChild('editTemplate') editTemplate!: TemplateRef<any>; 

  constructor(private modalService: BsModalService) {}

  onEdit(item: any) {
    const initialState = {
      title: 'Cadastrar um Cliente',
      formTemplate: this.editTemplate, 
      
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  onDelete(item: any) {
    console.log('Delete item:', item);
  }

  back() {
    this.cadatrarUsuario = true;
  }
}
