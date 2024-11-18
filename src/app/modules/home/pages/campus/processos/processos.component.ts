import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { SelectInputComponent } from "../../../../../shared/components/inputs/select-input/select-input.component";
import { InputDefaultComponent } from "../../../../../shared/components/inputs/input-default/input-default.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProcessosService } from './services/processos.service';  // Importe o serviço correto
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { AddprocessosModalComponent } from "./components/add-processos-modal/add-processos-modal.component";

@Component({
  selector: 'app-processos',
  standalone: true,
  imports: [SelectInputComponent, InputDefaultComponent, ReactiveFormsModule, AddprocessosModalComponent, TableComponent],
  templateUrl: './processos.component.html',
  styleUrls: ['./processos.component.scss']
})
export class ProcessosComponent implements OnInit {
  cadatrarUsuario = true;
  pessoasData: any[] = [];  // Dados da tabela
  isLoading = false;
  bsModalRef?: BsModalRef;

  @ViewChild('editTemplate') editTemplate!: TemplateRef<any>;

  constructor(
    private processosService: ProcessosService,  
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.loadProcessos();  
  }

 
  loadProcessos() {
    this.isLoading = true;  

    this.processosService.carregarTodosProcessos(); 
    this.processosService.processos$.subscribe((processos) => {
     console.log('teste', processos)
      this.pessoasData = processos.map((cliente: any) => ({
        nome: cliente,
       'Cessação': cliente.cessacao,
       Status: cliente.status,
       Nome: cliente.contrato.cliente.contato.nome,
       CPF: cliente.contrato.cliente.cpf
      }))
      this.isLoading = false;  
    }, (error) => {
      console.error('Erro ao carregar processos:', error);
      this.isLoading = false;
    });
  }

  onEdit(item: any) {
    const initialState = {
      title: 'Editar um Processo',
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
