import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UserRole } from '../../../main';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);

  loginForm!: FormGroup;
  user: User = new User();
  errorMsg: string = '';
  fromCart!: boolean;

  // Form initialization and field validation setup
  ngOnInit(): void {
    // Origin of the page request
    this.fromCart = this.router.url.includes('login-cart');

    // Initialize the form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pswd: ['', Validators.required],
      permanent: [false],
    });
  }

  // Login method
  login(): void {
    const FORM_VAL = this.loginForm.value;
    const DATA = structuredClone(FORM_VAL);
    DATA.permanent = undefined; // Remove this property

    // Retrieve the user's data from DB
    this.userService.login(DATA).subscribe({
      next: (res: User[]) => {
        console.log(res);

        if (res.length > 0) {
          Object.assign(this.user, res[0]);

          // Store the logged-in user's data in local storage for a persistent session, or otherwise in session storage
          if (FORM_VAL.permanent) localStorage.setItem('connectedUser', JSON.stringify(this.user));
          else sessionStorage.setItem('connectedUser', JSON.stringify(this.user));

          // Redirect to the home page for the user and to the dashboard for the administrator
          this.router.navigate([
            this.user.role === UserRole.user ? (this.fromCart ? '/user-cart' : '/') : '/dashboard',
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
