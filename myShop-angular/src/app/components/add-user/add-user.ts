import { Component, Renderer2, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Countries } from '../../../data/countries';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser implements AfterViewInit {
  // The list of countries
  countries: any = new Countries();
  countriesHTMLSelect!: HTMLSelectElement;
  countriesHTMLOptions!: HTMLOptionsCollection;

  // The list of genders
  @ViewChild('genders') gendersDiv!: ElementRef;
  gendersHTMLInput!: NodeListOf<HTMLInputElement>;

  // The form and its data
  userForm!: FormGroup;
  users: any[] = [];

  // Oldest version of Angular
  // constructor(private formBuilder: FormBuilder) {}

  // Latest version of Angular
  private formBuilder = inject(FormBuilder);

  // To retrieve the HTML elements, in this class, the HTML tags <select>
  constructor(private renderer: Renderer2) {}

  // Form initialization and field validation setup
  ngOnInit(): void {
    // Populating the HTML <select> element for countries
    this.countriesHTMLSelect = this.renderer.selectRootElement('#country');
    let option!: HTMLOptionElement;
    this.countries.list.forEach((item: any) => {
      option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      this.countriesHTMLSelect.appendChild(option);
    });

    // Form initialization and field validation setup
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      pswd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      pswdConfirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      gender: ['0'],
      clothes: [false],
      accessories: [false],
      country: ['0'],
    });
  }

  // Method called after ngOnInit
  ngAfterViewInit(): void {
    // Initialize the properties containing the HTML elements
    this.gendersHTMLInput = this.gendersDiv.nativeElement.querySelectorAll('input[name="gender"]');
    this.countriesHTMLOptions = this.countriesHTMLSelect.options;
  }

  // Method called when the form is submitted
  add(): void {
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

    // Saving user data to local storage
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.users.push(USER);
    localStorage.setItem('users', JSON.stringify(this.users));

    // Confirmation message and form reset
    alert('Votre compte a été créé.');
    this.reset();
  }

  // Reset the form
  reset(): void {
    this.userForm.reset();
    this.gendersHTMLInput[2].checked = true;
    this.countriesHTMLOptions[this.countriesHTMLOptions.length - 1].selected = true;
  }
}
