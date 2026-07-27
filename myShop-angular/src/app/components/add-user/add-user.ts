import { Component, Renderer2, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Countries } from '../../../assets/ts/countries';

// Validators: check if the password confirmation is valid
export class CustomValidators {
  static confirmPswd() {
    return (control: AbstractControl): ValidationErrors | null => {
      const [PSWD, CONFIRM] = [control.get('pswd')?.value, control.get('confirm')?.value];

      console.log(control?.value);

      if (!CONFIRM) {
        control.get('confirm')?.setErrors({ required: true });
        return { required: true };
      } else if (PSWD !== CONFIRM) {
        control.get('confirm')?.setErrors({ notSame: true });
        return { notSame: true };
      } else {
        control.get('confirm')?.setErrors(null);
        return null;
      }
    }
  }
}

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser implements AfterViewInit {
  // The list of genders //////////////////////////////////////////////////////
  @ViewChild('genders') gendersDiv!: ElementRef;
  gendersHTMLInput!: NodeListOf<HTMLInputElement>;

  // The list of countries ////////////////////////////////////////////////////
  countries: any = new Countries();
  countriesHTMLSelect!: HTMLSelectElement;
  countriesHTMLOptions!: HTMLOptionsCollection;

  // To retrieve the HTML elements, in this class, the HTML tags <select>
  constructor(private renderer: Renderer2) {}

  // Populating the HTML <select> element for countries
  setCountries(): void {
    this.countriesHTMLSelect = this.renderer.selectRootElement('#country');
    let option!: HTMLOptionElement;
    this.countries.list.forEach((item: any) => {
      option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      this.countriesHTMLSelect.appendChild(option);
    });
  }

  // The form and its data: initialization and validation /////////////////////
  userForm!: FormGroup;
  users: any[] = [];

  // Oldest version of Angular
  // constructor(private formBuilder: FormBuilder) {}

  // Latest version of Angular
  private formBuilder = inject(FormBuilder);

  // Form initialization and field validation setup
  ngOnInit(): void {
    // Populating the HTML <select> element for countries
    this.setCountries();

    const PSWD_PATTERN =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&~"#'{([|_\\^@)\]=+}€¨$£¤%*<>,?;.:\/!§-])[a-zA-Z\d&~"#'{([|_\\^@)\]=+}€¨$£¤%*<>,?;.:\/!§-]{8,}$/;

    // Form initialization and field validation setup
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/\S{3,}/), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      pswd: ['', [Validators.required, Validators.pattern(PSWD_PATTERN)]],
      confirm: [''],
      gender: ['0'],
      clothes: [false],
      accessories: [false],
      country: ['0'],
    });

    this.userForm
      .get('confirm')
      ?.setValidators([Validators.required, CustomValidators.confirmPswd]);
    this.userForm.get('confirm')?.updateValueAndValidity();
  }

  // Method called after ngOnInit
  ngAfterViewInit(): void {
    // Initialize the properties containing the HTML elements
    this.gendersHTMLInput = this.gendersDiv.nativeElement.querySelectorAll('input[name="gender"]');
    this.countriesHTMLOptions = this.countriesHTMLSelect.options;
  }

  // Method called when the form is submitted /////////////////////////////////
  add(): boolean {
    const FORM_VAL = this.userForm.value;

    // Check if the email does not exist
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    if (this.users.some((user: any) => user.email == FORM_VAL.email)) {
      alert('Cet e-mail existe déjà !');
      return false;
    }

    // Manage the checkboxes
    let interests = [];
    if (FORM_VAL.clothes) interests.push(parseInt(FORM_VAL.clothes));
    if (FORM_VAL.accessories) interests.push(parseInt(FORM_VAL.accessories));

    // Create the result object
    const USER = {
      name: FORM_VAL.name.trim(),
      email: FORM_VAL.email,
      pswd: FORM_VAL.pswd,
      gender: parseInt(FORM_VAL.gender),
      interests: interests,
      country: parseInt(FORM_VAL.country),
      role: 0,
      isVisible: true,
    };

    // Saving user data to local storage
    this.users.push(USER);
    localStorage.setItem('users', JSON.stringify(this.users));

    // Confirmation message and form reset
    alert('Votre compte a été créé.');
    this.reset();
    return true;
  }

  // Reset the form ///////////////////////////////////////////////////////////
  reset(): void {
    this.userForm.reset();
    this.gendersHTMLInput[2].checked = true;
    this.countriesHTMLOptions[this.countriesHTMLOptions.length - 1].selected = true;
  }
}
