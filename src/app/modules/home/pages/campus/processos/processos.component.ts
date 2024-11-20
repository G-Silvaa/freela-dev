import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { SelectInputComponent } from "../../../../../shared/components/inputs/select-input/select-input.component";
import { InputDefaultComponent } from "../../../../../shared/components/inputs/input-default/input-default.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessosService } from './services/processos.service';  // Importe o serviço correto
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { AddprocessosModalComponent } from "./components/add-processos-modal/add-processos-modal.component";

@Component({
  selector: 'app-processos',
  standalone: true,
  imports: [SelectInputComponent, InputDefaultComponent, ReactiveFormsModule, AddprocessosModalComponent, TableComponent, FormsModule],
  templateUrl: './processos.component.html',
  styleUrls: ['./processos.component.scss']
})
export class ProcessosComponent implements OnInit {
  cadatrarUsuario = true;
  pessoasData: any[] = [];  
  isLoading = false;
  bsModalRef?: BsModalRef;
  selectedProcessoId?: number;

  @ViewChild('editTemplate') editTemplate!: TemplateRef<any>;

  constructor(
    private processosService: ProcessosService,  
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.loadProcessos();  
    this.aplicarFiltros();
  }

  loadProcessos() {
    this.isLoading = true;  

    this.processosService.carregarTodosProcessos(); 
    this.processosService.processos$.subscribe((processos) => {
      console.log('teste', processos);
      this.pessoasData = processos;
      this.isLoading = false;  
    }, (error) => {
      console.error('Erro ao carregar processos:', error);
      this.isLoading = false;
    });
  }

  filtros = {
    Nome: '', 
    CPF: '',
    Status: '',
  };

  limparFiltros() {
    this.filtros = {
      Status:'',
      Nome: '',
      CPF: ''
    };
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.isLoading = true;
    const filtrosComLabel = {
      ...this.filtros,
      CPF: this.limparCPF(this.filtros.CPF), // Limpar caracteres especiais do CPF
      Status: this.filtros.Status // Use diretamente o valor do status
    };
    this.processosService.buscarProcessosComFiltros(filtrosComLabel).subscribe(
      (response) => {
        if (Array.isArray(response.content)) {
          this.pessoasData = response.content;
        } else {
          console.error('A resposta da API não é um array:', response);
        }
        console.log("Dados filtrados:", this.pessoasData);
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao aplicar filtros:', error);
        this.isLoading = false;
      }
    );
  }

  limparCPF(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  onEdit(item: any) {
    // Verifique a estrutura do objeto item para garantir que a propriedade id está presente
    const processoId = item.id || item.nome?.id;
  
    if (!processoId) {
      console.error('ID do processo não encontrado:', item);
      return;
    }
  
    const initialState = {
      title: 'Editar um Processo',
      formTemplate: this.editTemplate,
      processoId: processoId // Envia o processoId para o modal
    };
  
    this.bsModalRef = this.modalService.show(AddprocessosModalComponent, {
      initialState, // Passa o estado inicial ao modal
    });
    this.bsModalRef.content.closeBtnName = 'Close';
  
    console.log('Edit item:', processoId);
  }
  
  onDelete(item: any) {
    console.log('Delete item:', item);
  }

  back() {
    this.cadatrarUsuario = true;
  }
}