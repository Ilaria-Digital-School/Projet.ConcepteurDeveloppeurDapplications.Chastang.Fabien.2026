import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnumRoles } from '../../enums/user-roles';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';
import { Tooltip } from '../tooltip/tooltip';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Tooltip],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Native classes / Application services
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);

  // Class properties
  loginForm!: FormGroup;
  user: User = new User();
  errorMsg: string = '';
  fromCart!: boolean;
  helpHTML: string = `
    Les champs marqués d'une étoile (<span style="color: red; padding: 0 3px">*</span>) sont
    obligatoires.
  `;

  // Form initialization and field validation setup
  ngOnInit() {
    // Origin of the page request
    this.fromCart = this.router.url.includes('login-cart');

    // Initialize the form
    this.loginForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.email]],
      pswd: ['', Validators.required],
      permanent: [true],
    });
  }

  // Check the maximum length
  warningMaxlength(value: string, maxlen: number): boolean {
    return typeof value === 'string' && value.length === maxlen;
  }

  // Login method
  login() {
    const FORM_VAL = this.loginForm.value;
    const DATA = {
      email: FORM_VAL.userEmail,
      pswd: FORM_VAL.pswd,
    };

    // Retrieve the user's data from DB
    this.userService.login(DATA).subscribe({
      next: (res: User[]) => {
        if (res.length > 0) {
          Object.assign(this.user, res[0]);

          // Store the logged-in user's data in local storage for a persistent session, or otherwise in session storage
          if (FORM_VAL.permanent) localStorage.setItem('connectedUser', JSON.stringify(this.user));
          else sessionStorage.setItem('connectedUser', JSON.stringify(this.user));

          // Redirect to the home page for the user and to the dashboard for the administrator
          this.router.navigate([
            this.user.role === EnumRoles.user ? (this.fromCart ? '/user-cart' : '/') : '/dashboard',
          ]);
        } else {
          this.errorMsg = 'E-mail ou mot de passe incorrect !';
        }
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Go to the add user form
  gotoAddUser() {
    this.router.navigate([this.fromCart ? '/add-user-cart' : '/add-user']);
  }
}
