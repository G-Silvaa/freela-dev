import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalComponent } from './shared/components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ButtonComponent } from './shared/components/button/button.component';
import { InputDefaultComponent } from "./shared/components/inputs/input-default/input-default.component";
import { PasswordInputComponent } from "./shared/components/inputs/password-input/password-input.component";
import { RouterOutlet } from '@angular/router';
import { TableComponent } from './shared/components/table/table.component';

interface Pessoa {
  nome: string;
  email: string;
  idade: number;
}

interface Curso {
  curso: string;
  duracao: number;
  ano: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [ModalComponent, RouterOutlet, CommonModule, ButtonComponent, InputDefaultComponent, PasswordInputComponent],
})
export class AppComponent {
  bsModalRef?: BsModalRef;
  columnsPessoas: string[] = ['nome', 'email', 'idade'];
  pessoas: Pessoa[] = [
    {
      nome: 'Enderson',
      email: 'enderson.linhares20@gmail.com',
      idade: 15,
    },
    {
      nome: 'Lorena',
      email: 'maria.lorena@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Enderson',
      email: 'enderson.linhares20@gmail.com',
      idade: 15,
    },
    {
      nome: 'Lorena',
      email: 'maria.lorena@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Enderson',
      email: 'enderson.linhares20@gmail.com',
      idade: 15,
    },
    {
      nome: 'Lorena',
      email: 'maria.lorena@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Enderson',
      email: 'enderson.linhares20@gmail.com',
      idade: 15,
    },
    {
      nome: 'Lorena',
      email: 'maria.lorena@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Enderson',
      email: 'enderson.linhares20@gmail.com',
      idade: 15,
    },
    {
      nome: 'Lorena',
      email: 'maria.lorena@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Enderson',
      email: 'enderson.linhares20@gmail.com',
      idade: 15,
    },
    {
      nome: 'Lorena',
      email: 'maria.lorena@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Enderson',
      email: 'enderson.linhares20@gmail.com',
      idade: 15,
    },
    {
      nome: 'Lorena',
      email: 'maria.lorena@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Enderson',
      email: 'enderson.linhares20@gmail.com',
      idade: 15,
    },
    {
      nome: 'Lorena',
      email: 'maria.lorena@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
    {
      nome: 'Pedro',
      email: 'pedro123@gmail.com',
      idade: 15,
    },
   
  ];

  columnsCurso: string[] = ['curso', 'duracao', 'ano'];
  cursos: Curso[] = [
    {
      curso: 'PHP',
      duracao: 3,
      ano: 2023,
    },
    {
      curso: 'Javascript',
      duracao: 5,
      ano: 2021,
    },
  ];
  constructor(private modalService: BsModalService) {}
}
