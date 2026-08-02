import { Component, inject, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { Countries, User } from '../../../main';
import { UserService } from '../../services/user-service';

// Custom validators for the entire form
export class CustomValidators {
  // Confirm password
  static confirmPswd(control: AbstractControl): ValidationErrors | null {
    const [PSWD, CONFIRM] = [control.get('pswd')?.value, control.get('confirm')?.value];
    return PSWD !== CONFIRM ? { pswdMismatch: true } : null;
  }
}

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser implements AfterViewInit {
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService)

  // The list of genders //////////////////////////////////////////////////////
  @ViewChild('genders') gendersDiv!: ElementRef;
  gendersHTMLInput!: NodeListOf<HTMLInputElement>;

  // The list of countries ////////////////////////////////////////////////////
  countriesHTMLSelect!: HTMLSelectElement;
  countriesHTMLOptions!: HTMLOptionsCollection;

  // To retrieve the HTML elements, in this class, the HTML tags <select>
  private renderer = inject(Renderer2);

  // Populating the HTML <select> element for countries
  setCountries(): void {
    this.countriesHTMLSelect = this.renderer.selectRootElement('#country');
    let option!: HTMLOptionElement;
    Countries.list.forEach((item: any) => {
      option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      this.countriesHTMLSelect.appendChild(option);
    });
  }

  // The form and its data: initialization and validation /////////////////////
  userForm!: FormGroup;
  isEditMode!: boolean;
  userId!: number;
  title!: string;
  btnAction!: string;
  users: User[] = [];
  user: User = new User();
  userIni: User = new User();

  // Oldest version of Angular
  // constructor(private formBuilder: FormBuilder) {}

  // Latest version of Angular
  private formBuilder = inject(FormBuilder);

  // Form initialization and field validation setup
  ngOnInit(): void {
    // Populating the HTML <select> element for countries
    this.setCountries();

    // Get the data
    this.userService.getAllUsers().subscribe((res: any) => {
      this.users = res.map((item:any) => {
        const USER = new User();
        Object.assign(USER, item);
        return USER;
      });
    });
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.isEditMode = this.userId ? true : false;

    if (this.isEditMode) {
      // Edit mode: retrieve the product by its ID
      this.title = 'Mise à jour';
      this.btnAction = 'Modifier';
      const USER = this.users.find((item: User) => (item.id = this.userId));
      if (USER) {
        Object.assign(this.user, USER)
        this.userIni = structuredClone(this.user);
      }
    } else {
      this.title = 'Inscription';
      this.btnAction = 'Ajouter';
    }

    // The password must contain at least 8 characters, all non-whitespace, including at least
    // one lowercase letter, one uppercase letter, one digit, and one special character
    const SPECIAL_CHR = '&~"#\'{([|_\\\\^@)\\]=+}€¨$£¤%*<>,?;.:/!§-';
    const PSWD_PATTERN = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[' +
        SPECIAL_CHR +
        '])[a-zA-Z\\d' +
        SPECIAL_CHR +
        ']{8,}$',
    );

    // Form initialization and field validation setup
    this.userForm = this.formBuilder.group({
      nameItem: [
        this.userIni.name,
        [Validators.required, Validators.pattern(/\S{3,}/), Validators.maxLength(50)],
      ],
      email: [this.userIni.email, [Validators.required, Validators.email]],
      pswd: [this.userIni.pswd, [Validators.required, Validators.pattern(PSWD_PATTERN)]],
      confirm: [this.userIni.pswd, Validators.required],
      gender: [this.userIni.gender.toString()],
      clothes: [this.userIni.interests.includes(1)],
      accessories: [this.userIni.interests.includes(2)],
      country: [this.userIni.country.toString()],
    });

    if (!this.isEditMode) {
      // Custom validator for the entire form
      this.userForm.setValidators(CustomValidators.confirmPswd);
      this.userForm.updateValueAndValidity();
    }
  }

  // Method called after ngOnInit
  ngAfterViewInit(): void {
    // Initialize the properties containing the HTML elements
    this.gendersHTMLInput = this.gendersDiv.nativeElement.querySelectorAll('input[name="gender"]');
    this.countriesHTMLOptions = this.countriesHTMLSelect.options;
  }

  // Method called when the form is submitted /////////////////////////////////
  submit(): void {
    const FORM_VAL = this.userForm.value;

    if (!this.isEditMode || (this.isEditMode && this.userIni.email != FORM_VAL.email)) {
      // Check if the email does not exist
      if (this.users.some((user: User) => user.email == FORM_VAL.email)) {
        alert('Cet e-mail existe déjà !');
        return;
      }
    }

    // Manage the checkboxes
    let interests = [];
    if (FORM_VAL.clothes) interests.push(1);
    if (FORM_VAL.accessories) interests.push(2);

    let toSave = false;
    if (this.isEditMode) {
      // Modify the user
      const NAME = FORM_VAL.nameItem.trim();
      if (this.userIni.name != NAME) {
        toSave = true;
        this.user.name = NAME;
      }
      if (this.userIni.email != FORM_VAL.email) {
        toSave = true;
        this.user.email = FORM_VAL.email;
      }
      const GENDER = parseInt(FORM_VAL.gender);
      if (this.userIni.gender != GENDER) {
        toSave = true;
        this.user.gender = GENDER;
      }
      if (
        [1, 2].some(
          (item: number) => this.userIni.interests.includes(item) !== interests.includes(item),
        )
      ) {
        toSave = true;
        this.user.interests = interests;
      }
      const COUNTRY = parseInt(FORM_VAL.country);
      if (this.userIni.country != COUNTRY) {
        toSave = true;
        this.user.country = COUNTRY;
      }
    } else {
      // Create the result object
      toSave = true;
      this.user.name = FORM_VAL.nameItem.trim();
      this.user.email = FORM_VAL.email;
      this.user.pswd = FORM_VAL.pswd;
      this.user.gender = parseInt(FORM_VAL.gender);
      this.user.interests = interests;
      this.user.country = parseInt(FORM_VAL.country);
      this.users.push(this.user);
    }

    if (toSave) {
      // Saving user data to local storage
      // localStorage.setItem('users', JSON.stringify(this.users));

      // Confirmation message and form reset
      alert(this.isEditMode ? 'Votre compte a été modifié.' : 'Votre compte a été créé.');
      if (!this.isEditMode) this.reset();
    }
  }

  // Reset the form ///////////////////////////////////////////////////////////
  reset(): void {
    if (this.isEditMode) {
      this.userForm.patchValue({
        nameItem: this.userIni.name,
        email: this.userIni.email,
        gender: this.userIni.gender.toString(),
        clothes: this.userIni.interests.includes(1),
        accessories: this.userIni.interests.includes(2),
        country: this.userIni.country.toString(),
      });
    } else {
      this.userForm.reset();
      this.gendersHTMLInput[2].checked = true;
      this.countriesHTMLOptions[this.countriesHTMLOptions.length - 1].selected = true;
    }
  }
}
