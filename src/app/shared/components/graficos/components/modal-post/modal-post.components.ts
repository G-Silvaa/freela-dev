import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "@shared/components/button/button.component";
import { SelectInputComponent } from "@shared/components/inputs/select-input/select-input.component";
import { RelatoriosService } from "@core/services/relatorios.service";
import { IRelatorioIntervalo } from "@core/interfaces/relatorios/relatorios.interface";

interface selectOptions {
  label: string;
  value: string;
}

@Component({
  selector: "app-modal-post",
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    SelectInputComponent
  ],
  templateUrl: "./modal-post.component.html",
  styleUrls: ["./modal-post.component.scss"],
})
export class modalPostComponent implements OnInit {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);
  protected bsModalRef = inject(BsModalRef);
  private relatoriosService = inject(RelatoriosService);

  @Output() closeModal = new EventEmitter<void>();
  @Input() title!: string;
  @Input() relatorioItem!: any;
  isLoading = false;

  mesesDoAno: selectOptions[] = [
    { label: "Janeiro", value: "JANEIRO"},
    { label: "Fevereiro", value: "FEVEREIRO"},
    { label: "Março", value: "MARCO"},
    { label: "Abril", value: "ABRIL"},
    { label: "Maio", value: "MAIO"},
    { label: "Junho", value: "JUNHO"},
    { label: "Julho", value: "JULHO"},
    { label: "Agosto", value: "AGOSTO"},
    { label: "Setembro", value: "SETEMBRO"},
    { label: "Outubro", value: "OUTUBRO"},
    { label: "Novembro", value: "NOVEMBRO"},
    { label: "Dezembro", value: "DEZEMBRO"},
  ]

  anos: selectOptions[] = [];

  form: FormGroup = this.formBuilder.group({
    mesInicio: [""],
    anoInicio: [""],
    mesConclusao: [""],
    anoConclusao: [""],
  });

  ngOnInit(): void {
    console.log(this.relatorioItem)
    this.generateYears(new Date().getFullYear(), 2000);
    console.log(this.anos)
  }


  onSave() {
    const data: IRelatorioIntervalo = {
      domain: null,
      args: {
        intervalo: {
          inicio: {
            ano: Number(this.form.value.anoInicio),
            mes: this.form.value.mesInicio,
          },
          termino: {
            ano: Number(this.form.value.anoConclusao),
            mes: this.form.value.mesConclusao,
          },
        }
      }
    }

    this.relatoriosService.downloadRelatorioIntervalo(data, this.relatorioItem.value);
    this.onCloseModal();
  }

  onCloseModal() {
    this.modalService.hide();
  }

  generateYears(startYear: number, endYear: number): void {
    for (let year = startYear; year >= endYear; year--) {
      const option = {
        label: year.toString(),
        value: year.toString(),
      }
      this.anos.push(option);
    }
  }
}
