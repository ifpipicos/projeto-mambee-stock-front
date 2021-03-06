import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/core/models/user/user.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  public userForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.authUser().subscribe(user=>{
      this.userService.get(user.uid).subscribe(doc=>{
        if(doc.role !== 'admin'){
          this.router.navigate(['/'])
        }
      })
    })
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      matriculation: [''],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      itens_in_possession: [{name: '', idItem: ''}]
    });
  }

  register(): void {
    this.authService
      .signup(this.userForm.getRawValue())
      .then(() => {
        Swal.fire(
          'Usuário cadastrado com sucesso',
          'Agora efetue o seu login',
          'success'
        );
        this.userForm.reset();
      })
      .catch((error) => {
        let errorMessage: string;
        switch (error.code) {
          case 'auth/email-already-in-use': {
            errorMessage = 'O e-mail já está em uso';
            break;
          }
          case 'auth/invalid-email': {
            errorMessage = 'Formato de e-mail inválido';
            break;
          }
          default: {
            errorMessage = error.message;
          }
        }
        Swal.fire('Erro ao cadastrar o usuário', errorMessage, 'error');
        this.userForm.reset();
      });
  }

}
