import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router) {}

  loginForm!: FormGroup;
  users: any[] = [];
  user!: any;
  errorMsg: string = '';

  private formBuilder = inject(FormBuilder);

  // Form initialization and field validation setup
  ngOnInit(): void {
    // Form initialization and field validation setup
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pswd: ['', Validators.required],
      permanent: [false],
    });
  }

  login(): void {
    const FORM_VAL = this.loginForm.value;

    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.user = this.users.find(
      (user: any) => user.email == FORM_VAL.email && user.pswd == FORM_VAL.pswd,
    );

    if (this.user) {
      if (FORM_VAL.permanent) localStorage.setItem('currentUser', JSON.stringify(this.user));
      else sessionStorage.setItem('currentUser', JSON.stringify(this.user));

      this.router.navigate(['/']);
    } else {
      this.errorMsg = 'E-mail ou mot de passe incorrect !';
    }
  }
}
