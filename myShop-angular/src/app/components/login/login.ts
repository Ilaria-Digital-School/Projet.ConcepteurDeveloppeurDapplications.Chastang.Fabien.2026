import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User, UserRole } from '../../../main';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);

  loginForm!: FormGroup;
  user: User | null = null;
  errorMsg: string = '';

  // Form initialization and field validation setup
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pswd: ['', Validators.required],
      permanent: [false],
    });
  }

  // Login method
  login(): void {
    // Retrieve the user's data from DB
    const FORM_VAL = this.loginForm.value;
    this.userService.login(FORM_VAL).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.user = new User();
          Object.assign(this.user, res[0]);

          // Store the logged-in user's data in local storage for a persistent session, or otherwise in session storage
          if (FORM_VAL.permanent) localStorage.setItem('connectedUser', JSON.stringify(this.user));
          else sessionStorage.setItem('connectedUser', JSON.stringify(this.user));

          // Redirect to the home page for the user and to the dashboard for the administrator
          this.router.navigate([this.user.role === UserRole.user ? '/' : '/dashboard']);
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
}
