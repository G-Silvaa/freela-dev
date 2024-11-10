import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'; // Importar TemplateRef e ViewChild
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { InputDefaultComponent } from "../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../shared/components/inputs/select-input/select-input.component";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { pessoasData, primeiroFiltro, segundoFiltro, terceiroFiltro, adicionarPessoasData } from './data/data';
import { Span } from '@opentelemetry/sdk-trace-web';
import { AddUsersModalComponent } from "./components/add-users-modal/add-users-modal.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { UsuariosService } from '@modules/administracao/services/usuarios.service';
import { ClientesService } from './services/clientes.service';
import { id } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pessoas',
  standalone: true,
  imports: [TableComponent, InputDefaultComponent, SelectInputComponent, ModalComponent, AddUsersModalComponent, ButtonComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  cadatrarUsuario = true;
  pessoasData = [];
  adicionarPessoasData = adicionarPessoasData;
  primeiroFiltro = primeiroFiltro;
  segundoFiltro = segundoFiltro;
  terceiroFiltro = terceiroFiltro;
  isLoading = false;
  bsModalRef?: BsModalRef;

  @ViewChild('editTemplate') editTemplate!: TemplateRef<any>; 

  constructor(private modalService: BsModalService, private usuarioService: ClientesService) {}

  ngOnInit(): void {
    this.loaclientes();
  }
  onEdit(item: any) {
    const initialState = {
      title: 'Cadastrar um Cliente',
      formTemplate: this.editTemplate, 
      
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  onDelete(item: any) {
    console.log('Delete item:', item);
  }

  loaclientes() {
    this.usuarioService.pegarUsuario().subscribe((response) => {
console.log('response', response);
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
      console.error('Error:', error);
    }); 
  }


  back() {
    this.cadatrarUsuario = true;
  }
}