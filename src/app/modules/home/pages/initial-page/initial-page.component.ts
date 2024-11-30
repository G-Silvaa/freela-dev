import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GraficosComponent } from "../../../../shared/components/graficos/graficos.component";
import { PieChartComponent } from "../../../../shared/components/graficos/grafico-pie/grafico-pie.component";
import { TableComponent } from "../../../../shared/components/table/table.component";
import { GraficosService } from '@modules/home/pages/initial-page/services/initial.service';
import { TableComponent2 } from '@shared/components/table-scroll/table.component';

@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [CommonModule, GraficosComponent, PieChartComponent, TableComponent, TableComponent2],
  templateUrl: './initial-page.component.html',
  styleUrls: ['./initial-page.component.scss'],
})
export class InitialPageComponent implements OnInit {
  pessoasData: any[] = [];

  constructor(private readonly graficosService: GraficosService) {}

  ngOnInit(): void {
    this.fetchDadosDaTabela();
  }

  fetchDadosDaTabela(): void {
    this.graficosService.getDadosDaTabela().subscribe((response) => {
      this.pessoasData = response.content;
    });
  }
}