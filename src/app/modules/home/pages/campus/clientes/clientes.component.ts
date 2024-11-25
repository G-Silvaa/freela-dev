import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

export interface IContato {
  nome: string;
  email: string;
  telefone: string;
}

export interface ICliente {
  id: number;
  contato: IContato;
  cpf: string;
  rg: string;
  nascimento: string;
  representante?: IRepresentante;
}

interface ClienteTabela {
  id: number;
  Nome: string;
  CPF: string;
  RG: string;
  'E-mail': string;
  'Tem representante?': string;
}

export interface IRepresentante {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  parentesco: string;
  cpf: string;
  rg: string;
  nascimento: string;
}

@Component({
  selector: 'app-pessoas',
  standalone: true,
  imports: [
    FormsModule,
    TableComponent,
    InputDefaultComponent,
    AddUsersModalComponent,
    EditUsersModalComponent
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  cadastrarUsuario = true;
  pessoasData: ClienteTabela[] = [];
  isLoading = false;
  bsModalRef?: BsModalRef;

  filtros = {
    nome: '',
    email: '',
    rg: '',
    cpf: ''
  };

  @ViewChild('adicionar') adicionar!: TemplateRef<any>;
  @ViewChild('editar') editar!: TemplateRef<any>;

  constructor(private modalService: BsModalService, private usuarioService: ClientesService) {}

  ngOnInit(): void {
    // Observa alterações na lista de clientes
    this.usuarioService.clientes$.subscribe((clientes) => {
      this.pessoasData = clientes.map((cliente: ICliente) => ({
        id: cliente.id,
        Nome: cliente.contato.nome,
        CPF: cliente.cpf,
        RG: cliente.rg,
        'E-mail': cliente.contato.email,
        'Tem representante?': this.temRepresentante(cliente.representante),
      }));
    });

    this.usuarioService.carregarTodosUsuarios(); // Carrega os dados iniciais
  }
  adicionarCliente() {
    const initialState = {
      title: 'Cadastrar um Cliente',
      formTemplate: this.adicionar
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState, class: 'modal-lg' });
  }

  onEdit(item: any) {
    this.usuarioService.buscarClientePorId(item.id).subscribe((cliente) => {
      console.log('Cliente:', cliente);
      const initialState = {
        title: 'Editar um Cliente',
        formTemplate: this.editar,
        data: cliente
      };
      this.bsModalRef = this.modalService.show(EditUsersModalComponent, { initialState, class: 'modal-lg' });
    }, (error) => {
      console.error('Erro ao buscar cliente:', error);
    });
  }


  onDelete(item: any) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Essa ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deletarUsuario(item.id).subscribe(() => {
          Swal.fire('Deletado!', 'O cliente foi removido.', 'success');
        }, (error) => {
          Swal.fire('Erro!', 'Ocorreu um erro ao remover o cliente.', 'error');
        });
      }
    });
  }

  aplicarFiltros() {
    this.isLoading = true;
    const filtrosComCpfLimpo = {
      ...this.filtros,
      cpf: this.limparCPF(this.filtros.cpf)
    };
    console.log('Filtros aplicados:', filtrosComCpfLimpo);
    this.usuarioService.buscarClientesComFiltros(filtrosComCpfLimpo).subscribe((response) => {
      if (Array.isArray(response.content)) {
        this.pessoasData = response.content.map((cliente: ICliente) => ({
          id: cliente.id,
          Nome: cliente.contato.nome,
          CPF: cliente.cpf,
          RG: cliente.rg,
          'E-mail': cliente.contato.email,
          'Tem representante?': this.temRepresentante(cliente.representante),
        }));
      } else {
        console.error('A resposta da API não é um array:', response);
      }
      this.isLoading = false;
    }, (error) => {
      console.error('Erro ao aplicar filtros:', error);
      this.isLoading = false;
    });
  }


  limparCPF(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  limparFiltros() {
    this.filtros = {
      nome: '',
      email: '',
      rg: '',
      cpf: ''
    };
    this.aplicarFiltros();
  }

  temRepresentante(representante: IRepresentante | null | undefined): string {
    return representante && representante.id ? 'Sim' : 'Não';
  }


}
