import { Component, OnInit, TemplateRef } from '@angular/core';
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
    private loading: NgxSpinnerService
    )
    { }

  public ngOnInit(): void {
    this.loading.show();
    this.getEventos();
  }

  public getEventos(): void {
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.notify.success('Item excluído com sucesso.', 'Excluído!');
    this.modalRef?.hide();
  }

  decline(): void {
    this.modalRef?.hide();
  }

}
