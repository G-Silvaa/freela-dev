import { CommonModule, TitleCasePipe } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";

interface DataItem<T> {
  [key: string]: T;
}

@Component({
  selector: "app-tablescroll",
  standalone: true,
  imports: [TitleCasePipe, CommonModule],
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent2<T> implements OnInit, OnDestroy {
  @Input() columns!: string[];
  @Input() data!: DataItem<T>[];
  @Input() showActions: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() showOpcoes: boolean = false;
  @Input() showRenew?: boolean = false;
  @Input() showBaixarContrato?: boolean = false;
  @Input() itemsPerPage: number = 10;
  @Input() showAllActions: boolean = true;

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() gerarCartas = new EventEmitter<{ id: any; tipo: any }>();
  @Output() renewContract = new EventEmitter<{ id: any }>();

  currentPage: number = 1;
  dropdownOpen: any = null;

  ngOnInit() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.dropdownOpen = null;
    }
  }

  get paginatedData(): DataItem<T>[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.data.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  truncateText(column: string, item: any): string {
    const value = item[column];
    if (typeof value === "string" && value.length > 30) {
      return value.slice(0, 30) + "...";
    }
    return value;
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }

  gerarCartas2(id: any, tipo: any) {
    this.gerarCartas.emit({ id, tipo });
  }

  toggleDropdown(id: any) {
    this.dropdownOpen = this.dropdownOpen === id ? null : id;
  }

  emitRenewContractId(item: any) {
    this.renewContract.emit({ id: item.Id });
  }

  get visiblePages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const visiblePages: number[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const firstPages = [1, 2, 3];
    const lastPages = [totalPages - 2, totalPages - 1, totalPages];

    if (currentPage <= 4) {
      visiblePages.push(...firstPages, 4, 5, -1, ...lastPages);
    } else if (currentPage >= totalPages - 3) {
      visiblePages.push(
        ...firstPages,
        -1,
        totalPages - 4,
        totalPages - 3,
        ...lastPages,
      );
    } else {
      visiblePages.push(
        1,
        2,
        -1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        -1,
        totalPages - 1,
        totalPages,
      );
    }

    return visiblePages;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }
}