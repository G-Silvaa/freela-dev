import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { InputDefaultComponent } from "../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../shared/components/inputs/select-input/select-input.component";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddUsersModalComponent } from "./components/add-users-modal/add-users-modal.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { ClientesService } from './services/clientes.service';
import { EditUsersModalComponent } from './components/edit-users-modal/edit-users-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pessoas',
  standalone: true,
  imports: [
    TableComponent,
    InputDefaultComponent,
    SelectInputComponent,
    ModalComponent,
    AddUsersModalComponent,
    ButtonComponent,
    EditUsersModalComponent
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  cadatrarUsuario = true;
  pessoasData: any[] = [];
  isLoading = false;
  bsModalRef?: BsModalRef;

  @ViewChild('adicionar') adicionar!: TemplateRef<any>; 
  @ViewChild('editar') editar!: TemplateRef<any>;

  constructor(private modalService: BsModalService, private usuarioService: ClientesService) {}

  ngOnInit(): void {
    this.loaclientes();
    this.usuarioService.clienteAdicionado$.subscribe((novoCliente) => {
      this.pessoasData.push({
        id: novoCliente.id,
        Nome: novoCliente.contato.nome,
        CPF: novoCliente.cpf,
        RG: novoCliente.rg,
        'E-mail': novoCliente.contato.email,
        'Tem representante?': novoCliente.representante ? 'Sim' : 'Não'
      });
    });
    this.usuarioService.clienteDeletado$.subscribe((id) => {
      this.pessoasData = this.pessoasData.filter(cliente => cliente.id !== id);
    });
  }

  adicionarcliente() {
    const initialState = {
      title: 'Cadastrar um Cliente',
      formTemplate: this.adicionar
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  onEdit(item: any) {
    const initialState = {
      title: 'Editar um Cliente',
      formTemplate: this.editar,
      data: item
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.closeBtnName = 'Close';
    console.log('Edit item:', item);
  }

  onDelete(item: any) {
    console.log('Delete item:', item);
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, delete!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deletarUsuario(item).subscribe(() => {
          this.usuarioService.emitirClienteDeletado(item);
          Swal.fire(
            'Deletado!',
            'O usuário foi deletado.',
            'success'
          );
        }, (error) => {
          console.error('Erro ao deletar usuário:', error);
          Swal.fire(
            'Erro!',
            'Ocorreu um erro ao deletar o usuário.',
            'error'
          );
        });
      }
    });
  }

  loaclientes() {
    this.usuarioService.pegarUsuario().subscribe((response) => {
      this.pessoasData = response.map((element: any) => ({
        id: element.id,
        Nome: element.contato.nome,
        CPF: element.cpf,
        RG: element.rg,
        'E-mail': element.contato.email,
        'Tem representante?': element.representante ? 'Sim' : 'Não'
      }));
      console.log('response', this.pessoasData);
    }, (error) => {
      console.error('Error fetching data:', error);
    }); 
  }

  back() {
    this.cadatrarUsuario = true;
  }
}