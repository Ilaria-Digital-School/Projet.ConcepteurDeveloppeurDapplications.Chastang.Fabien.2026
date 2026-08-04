import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../main';
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

  loginForm!: FormGroup;
  users!: User[];
  user: User = new User();
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
    this.userService.login(FORM_VAL).subscribe({
      next: (res: Object) => {
        Object.assign(this.user, res);
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    if (this.user) {
      if (FORM_VAL.permanent) localStorage.setItem('currentUser', JSON.stringify(this.user));
      else sessionStorage.setItem('currentUser', JSON.stringify(this.user));

      this.router.navigate(['/']);
    } else {
      this.errorMsg = 'E-mail ou mot de passe incorrect !';
    }
  }
}
