import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { idLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  form: FormGroup = this.fb.group({
    tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    local: ['', Validators.required],
    dataEvento: ['', Validators.required],
    qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
    telefone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    imagemUrl: ['', Validators.required],
  });

  evento = {} as Evento;
  estado : any = 'post';

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private router: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.carregarEvento();
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if (eventoIdParam != null) {
      this.spinner.show();
      this.estado = 'put';

      this.eventoService.getEventosById(Number(eventoIdParam)).subscribe({
        next: (evento: Evento) => {
          this.evento = evento;
          this.form.patchValue(this.evento);
        },
        error: (error: any) => {
          console.log(error);
          this.toastr.error('Erro ao tentar carregar evento.')
          this.spinner.hide();
        },
        complete: () => { this.spinner.hide(); },
      })
    }
  }

  get f(): any {
    return this.form.controls;
  }

  resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public salvar(): void {
    this.spinner.show();
    if (this.form.valid) {
      let servico;
      if (this.estado === 'post'){
        this.evento = {...this.form.value};
        servico = this.eventoService['post'](this.evento);
      }
      else{
        this.evento = {id: this.evento.id, ...this.form.value};
        servico = this.eventoService['put'](this.evento);
      }

      servico.subscribe({
        next:() => this.toastr.success('Evento salvo com sucesso.', 'Sucesso'),
        error: (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento', 'Erro');
        },
        complete: () => this.spinner.hide(),
      });

    }
  }

}
