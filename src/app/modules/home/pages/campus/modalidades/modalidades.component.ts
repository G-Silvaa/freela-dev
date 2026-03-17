import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ModalidadeReference,
  modalidadesReference,
  processRulesReference,
} from '@core/consts/modalidades-reference.const';

@Component({
  selector: 'app-modalidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modalidades.component.html',
  styleUrl: './modalidades.component.scss',
})
export class ModalidadesComponent {
  searchTerm = '';
  readonly modalidades = modalidadesReference;
  readonly processRules = processRulesReference;

  get filteredModalidades(): ModalidadeReference[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return this.modalidades;
    }

    return this.modalidades.filter((item) =>
      item.code.includes(normalizedSearch) ||
      item.label.toLowerCase().includes(normalizedSearch) ||
      item.category.toLowerCase().includes(normalizedSearch) ||
      item.notes.some((note) => note.toLowerCase().includes(normalizedSearch))
    );
  }

  get modalidadesComPericia(): number {
    return this.modalidades.filter((item) => item.periciaMedica).length;
  }

  get modalidadesComAvaliacao(): number {
    return this.modalidades.filter((item) => item.avaliacaoSocial).length;
  }

  get modalidadesComCessacao(): number {
    return this.modalidades.filter((item) => item.cessacaoQuandoAprovado).length;
  }

  trackByCode(_: number, item: ModalidadeReference): string {
    return item.code;
  }

  asBooleanLabel(value: boolean): string {
    return value ? 'Sim' : 'Não';
  }
}
