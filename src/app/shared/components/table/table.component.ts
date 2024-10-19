import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface DataItem<T> {
  [key: string]: T;
}

interface Item {
  [key: string]: any;
}

@Component({
  selector: 'intra-table',
  standalone: true,
  imports: [TitleCasePipe, CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> {
  @Input() columns!: string[];
  @Input() data!: DataItem<T>[];
  @Input() showActions: boolean = true;
  @Input() itemsPerPage: number = 6; // Número de itens por página
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  items: Item[] = [];

  currentPage: number = 1;

  get paginatedData(): DataItem<T>[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.data.slice(start, end);
  }

  truncateText(column: string, item: Item): string {
    const value = item[column];
    if (typeof value === 'string' && value.length > 30) {
      return value.slice(0, 30) + '...';
    }
    return value;
  }

  onEdit(item: T) {
    this.edit.emit(item);
  }

  onDelete(item: T) {
    this.delete.emit(item);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.data.length / this.itemsPerPage))
      .fill(0)
      .map((_, i) => i + 1);
  }

  get visiblePages(): number[] {
    const totalPages = this.totalPages.length;
    const currentPage = this.currentPage;
    const visiblePages: number[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const firstPages = [1, 2, 3, 4];
    const lastPages = [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

    if (currentPage <= 4) {
      visiblePages.push(...firstPages);
      visiblePages.push(-1);
      visiblePages.push(...lastPages);
    } else if (currentPage >= totalPages - 3) {
      visiblePages.push(...firstPages);
      visiblePages.push(-1);
      visiblePages.push(...lastPages);
    } else {
      visiblePages.push(1, 2);
      visiblePages.push(-1);
      visiblePages.push(currentPage - 1, currentPage, currentPage + 1);
      visiblePages.push(-1);
      visiblePages.push(totalPages - 1, totalPages);
    }

    return visiblePages;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}