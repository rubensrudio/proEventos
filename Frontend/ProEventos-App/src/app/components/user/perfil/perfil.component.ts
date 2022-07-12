import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from 'src/app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  form: FormGroup = new FormGroup({
    graduacao: new FormControl(''),
    nome: new FormControl(''),
    sobrenome: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    funcao: new FormControl(''),
    descricao: new FormControl(''),
    senha: new FormControl(''),
    confirmaSenha: new FormControl(''),
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.validation();
  }

  get f(): any {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
  }

  resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  private validation(): void {
    this.form = this.fb.group({
      graduacao: ['', Validators.required],
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      funcao: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      senha: ['', [Validators.required]],
      confirmaSenha: ['', [Validators.required]],
    },
    {
      validators: [ValidatorField.MustMatch('senha', 'confirmaSenha')]
    });
  }

}
