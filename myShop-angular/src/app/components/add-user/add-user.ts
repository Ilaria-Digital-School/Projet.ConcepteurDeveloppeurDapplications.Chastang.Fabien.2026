import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {
  userForm!: FormGroup;
  users: any[] = [];

  // Oldest version of Angular
  // constructor(private formBuilder:FormBuilder) {}

  // Latest version of Angular
  private formBuilder = inject(FormBuilder);

  // Form data validation method
  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      pswd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      pswdConfirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      gender: ['', Validators.required],
      clothes: [false],
      accessories: [false],
      country: ['', Validators.required],
    });
  }

  // Method called when the form is submitted
  add() {
    const FORM_VAL = this.userForm.value;

    // Manage the checkboxes
    let interests = [];
    if (FORM_VAL.clothes) interests.push('clothes');
    if (FORM_VAL.accessories) interests.push('accessories');

    // Create the result object
    const USER = {
      name: FORM_VAL.name,
      email: FORM_VAL.email,
      pswd: FORM_VAL.pwd,
      gender: FORM_VAL.gender,
      interests: interests,
      country: FORM_VAL.country,
    };

    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.users.push(USER);
    localStorage.setItem('users', JSON.stringify(this.users));
    alert('Votre compte a été créé.');
  }
}
