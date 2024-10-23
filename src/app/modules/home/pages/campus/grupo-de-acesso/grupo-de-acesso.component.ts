import { Component, TemplateRef, ViewChild } from '@angular/core'; // Importar TemplateRef e ViewChild
import { InputDefaultComponent } from '@shared/components/inputs/input-default/input-default.component';
import { SelectInputComponent } from '@shared/components/inputs/select-input/select-input.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TableComponent } from '@shared/components/table/table.component';
import { AddUsersModalComponent } from '../pessoas/components/add-users-modal/add-users-modal.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { adicionarPessoasData, pessoasData, primeiroFiltro, segundoFiltro, terceiroFiltro } from '../pessoas/data/data';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-grupo-de-acesso',
  standalone: true,
  imports: [TableComponent, InputDefaultComponent, SelectInputComponent, ModalComponent, AddUsersModalComponent, ButtonComponent],
  templateUrl: './grupo-de-acesso.component.html',
  styleUrl: './grupo-de-acesso.component.scss'
})
export class GrupoDeAcessoComponent {
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
