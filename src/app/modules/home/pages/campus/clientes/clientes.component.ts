import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

import { TableComponent } from '../../../../../shared/components/table/table.component';
import { InputDefaultComponent } from '../../../../../shared/components/inputs/input-default/input-default.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { AddUsersModalComponent } from './components/add-users-modal/add-users-modal.component';
import { EditUsersModalComponent } from './components/edit-users-modal/edit-users-modal.component';
import { ClientesService } from './services/clientes.service';
import { AuthService } from '@core/services/auth/auth.service';

export interface IContato {
  nome: string;
  email: string;
  telefone: string;
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

@Component({
  selector: 'app-pessoas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    InputDefaultComponent,
    AddUsersModalComponent,
    EditUsersModalComponent,
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
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

  constructor(
    private modalService: BsModalService,
    private usuarioService: ClientesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.usuarioService.clientes$.subscribe((clientes) => {
      this.pessoasData = clientes.map((cliente: ICliente) => ({
        id: cliente.id,
        Nome: cliente.contato.nome,
        CPF: cliente.cpf,
        RG: cliente.rg,
        'E-mail': cliente.contato.email,
        'Tem representante?': this.temRepresentante(cliente.representante),
      }));
      this.isLoading = false;
    });

    this.usuarioService.carregarTodosUsuarios();
  }

  get totalClientes(): number {
    return this.pessoasData.length;
  }

  get clientesComRepresentante(): number {
    return this.pessoasData.filter((cliente) => cliente['Tem representante?'] === 'Sim').length;
  }

  get clientesSemRepresentante(): number {
    return this.pessoasData.filter((cliente) => cliente['Tem representante?'] === 'Não').length;
  }

  get emailsCadastrados(): number {
    return this.pessoasData.filter((cliente) => !!cliente['E-mail']).length;
  }

  get canManageClientes(): boolean {
    return this.authService.canManageClientes();
  }

  get baseCadastralDescription(): string {
    return this.canManageClientes
      ? 'Listagem principal para edição e exclusão dos registros.'
      : 'Listagem em modo consulta para visualizar cadastros e representantes.';
  }

  adicionarCliente() {
    const initialState = {
      title: 'Cadastrar um Cliente',
      subtitle: 'Cadastro guiado com dados pessoais, endereço, representante e contrato inicial.',
      iconTemplate: 'bi bi-person-vcard-fill',
      formTemplate: this.adicionar
    };
    this.bsModalRef = this.modalService.show(ModalComponent, {
      initialState,
      class: 'modal-xl liv-form-modal'
    });
  }

  onEdit(item: any) {
    this.usuarioService.buscarClientePorId(item.id).subscribe((cliente) => {
      const initialState = {
        title: 'Editar um Cliente',
        formTemplate: this.editar,
        data: cliente
      };
      this.bsModalRef = this.modalService.show(EditUsersModalComponent, {
        initialState,
        class: 'modal-xl liv-form-modal'
      });
    }, () => {
      Swal.fire('Erro!', 'Não foi possível carregar o cliente selecionado.', 'error');
    });
  }

  onDelete(item: any) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: 'Essa ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#112641',
      cancelButtonColor: '#b64146',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deletarUsuario(item.id).subscribe(() => {
          Swal.fire('Cliente removido', 'O cadastro foi excluído com sucesso.', 'success');
        }, () => {
          Swal.fire('Erro!', 'Ocorreu um erro ao remover o cliente.', 'error');
        });
      }
    });
  }

  aplicarFiltros() {
    if (!this.filtros.nome && !this.filtros.email && !this.filtros.rg && !this.filtros.cpf) {
      this.isLoading = true;
      this.usuarioService.carregarTodosUsuarios();
      return;
    }

    this.isLoading = true;
    const filtrosComCpfLimpo = {
      ...this.filtros,
      cpf: this.limparCPF(this.filtros.cpf)
    };

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
      }
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      Swal.fire('Erro!', 'Ocorreu um erro ao aplicar os filtros.', 'error');
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
    this.isLoading = true;
    this.usuarioService.carregarTodosUsuarios();
  }

  temRepresentante(representante: IRepresentante | null | undefined): string {
    return representante && representante.id ? 'Sim' : 'Não';
  }
}
