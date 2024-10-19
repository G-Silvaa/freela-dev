import { Component, TemplateRef, ViewChild } from '@angular/core'; // Importar TemplateRef e ViewChild
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { InputDefaultComponent } from "../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../shared/components/inputs/select-input/select-input.component";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { pessoasData, primeiroFiltro, segundoFiltro, terceiroFiltro, adicionarPessoasData } from './data/data';
import { Span } from '@opentelemetry/sdk-trace-web';
import { AddUsersModalComponent } from "./components/add-users-modal/add-users-modal.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

@Component({
  selector: 'app-pessoas',
  standalone: true,
  imports: [TableComponent, InputDefaultComponent, SelectInputComponent, ModalComponent, AddUsersModalComponent, ButtonComponent],
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.scss']
})
export class PessoasComponent {
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
      title: 'Adicionar Identificação',
      formTemplate: this.editTemplate, 
      iconTemplate: 'bi bi-pencil'
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