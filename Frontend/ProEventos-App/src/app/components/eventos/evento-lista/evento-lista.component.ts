import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../../../models/Evento';
import { EventoService } from '../../../services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public exibeImg = false;
  private filtroListado = '';
  eventoId = 0;

  modalRef?: BsModalRef;

  public get filtroLista(): string {
    return this.filtroListado;
  }

  public set filtroLista(value: string){
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private notify: ToastrService,
    private loading: NgxSpinnerService,
    private router: Router
    )
    { }

  public ngOnInit(): void {
    this.loading.show();
    this.carregarEventos();
  }

  public carregarEventos(): void {
    const observer =
    {
      next: (eventos: Evento[]) =>
      {
        this.eventos = eventos;
        this.eventosFiltrados = eventos;
      },
      error: (error: any) =>
      {
        this.loading.hide();
        this.notify.error('Erro ao carregar itens.', 'Erro!');
      },
      complete: () => this.loading.hide()
    }
    this.eventoService.getEventos().subscribe(observer);
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.loading.show();
    this.modalRef?.hide();
    this.eventoService.deleteEventos(this.eventoId).subscribe({
      next: (result: any) => {
        this.notify.success('Item excluído com sucesso.', 'Excluído!');
        this.carregarEventos();
      },
      error: (error: any) => {
        this.notify.error(`Erro ao tentar deletar o evento ${this.eventoId}.`, 'Erro');
        console.error(error);
      }
    }).add(() => this.loading.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}
