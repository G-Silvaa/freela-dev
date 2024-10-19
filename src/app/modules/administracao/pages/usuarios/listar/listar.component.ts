import {Component, OnInit} from '@angular/core';
import {UsuariosService} from "@modules/administracao/services/usuarios.service";
import {JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf
  ],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.scss'
})
export class ListarComponent implements OnInit {
  public usuarios: any[] = [];
  public buscando: boolean = false;

  constructor(private usuarioService: UsuariosService) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.buscando = true;
    this.usuarioService.listar().subscribe(res => {
      this.usuarios = res;
      this.buscando = false;
    });
  }
}
