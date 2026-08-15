import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { EnumInterests } from '../../enums/user-interests';
import { Interests } from '../../constants/interests';
import { Countries } from '../../constants/countries';
import { User } from '../../models/user';
import { FormHelp } from '../form-help/form-help';
// import { JsonPipe } from '@angular/common';

// Custom validators for the entire form /////////////////////////////////

export class CustomValidators {
  // Confirm password
  static confirmPswd(control: AbstractControl): ValidationErrors | null {
    const [PSWD, CONFIRM] = [control.get('pswd')?.value, control.get('confirm')?.value];
    return PSWD !== CONFIRM ? { pswdMismatch: true } : null;
  }
}

// Component /////////////////////////////////////////////////////////////

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, FormHelp /*, JsonPipe*/],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {
  Countries = Countries;

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  userForm!: FormGroup;
  isEditMode!: boolean;
  userId!: string | null;
  title!: string;
  btnAction!: string;
  user: User = new User();
  userIni: User = new User();
  users: User[] = [];
  fromCart!: boolean;
  valuesChange: boolean = false;

  helpHTML: string = `
    Les champs marqués d'une étoile (<span style="color: red; padding: 0 3px">*</span>) sont
    obligatoires.
  `;

  // Form initialization and validation ///////////////////////////////////////

  // Form definition and validation
  ngOnInit() {
    // Origin of the page request
    this.fromCart = this.router.url.includes('add-user-cart');

    // Get user ID if it exists
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEditMode = this.userId ? true : false;
    const RE_NAME = /(.{0,}\S.{0,}){3,}/;

    if (this.isEditMode) {
      // Edit mode: retrieve the user by its ID
      this.title = 'Mise à jour';
      this.btnAction = 'Modifier';

      // Form validation
      this.userForm = this.formBuilder.group({
        userName: ['', [Validators.required, Validators.pattern(RE_NAME)]],
        userEmail: ['', [Validators.required, Validators.email]],
        gender: ['0'],
        clothes: [false],
        accessories: [false],
        country: ['0'],
      });

      this.userService.getUserById(this.userId).subscribe({
        next: (res: User) => {
          this.user = structuredClone(res);
          this.userIni = structuredClone(res);
          this.initFormValues();
        },
        error: (err: any) => {
          console.log(err);
        },
      });

      // To detect changes
      this.userForm.valueChanges.subscribe((formValue: any) => {
        this.valuesChange =
          formValue.userName.trim() !== this.userIni.name ||
          formValue.userEmail !== this.userIni.email ||
          formValue.gender !== this.userIni.gender.toString() ||
          formValue.clothes !== this.userIni.interests.includes(1) ||
          formValue.accessories !== this.userIni.interests.includes(2) ||
          formValue.country !== this.userIni.country.toString();
      });
    } else {
      // Add a new user
      this.title = 'Inscription';
      this.btnAction = 'Ajouter';
      this.valuesChange = true;

      // The password must contain at least 10 characters, all non-whitespace, including at least
      // one lowercase letter, one uppercase letter, one digit, and one special character
      const SPECIAL_CHR = '&~"\'{([|_\\\\^@)\\]=+}€¨$£¤%*<>,?;.:/!§-';
      const PSWD_PATTERN = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[' +
          SPECIAL_CHR +
          '])[a-zA-Z\\d' +
          SPECIAL_CHR +
          ']{10,}$',
      );

      // Form validation
      this.userForm = this.formBuilder.group({
        userName: ['', [Validators.required, Validators.pattern(RE_NAME)]],
        userEmail: ['', [Validators.required, Validators.email]],
        pswd: ['', [Validators.required, Validators.pattern(PSWD_PATTERN)]],
        confirm: ['', Validators.required],
        gender: ['0'],
        clothes: [false],
        accessories: [false],
        country: ['0'],
      });

      // Custom validator for the entire form
      this.userForm.setValidators(CustomValidators.confirmPswd);
      this.userForm.updateValueAndValidity();
    }
  }

  // Initializing form values
  initFormValues() {
    this.userForm.patchValue({
      userName: this.userIni.name,
      userEmail: this.userIni.email,
      gender: this.userIni.gender.toString(),
      clothes: this.userIni.interests.includes(1),
      accessories: this.userIni.interests.includes(2),
      country: this.userIni.country.toString(),
    });
  }

  // Edit mode: to notify of a change
  hasChanged(): boolean {
    return this.valuesChange;
  }

  // Check the maximum length
  warningMaxlength(value: string, maxlen: number): boolean {
    return typeof value === 'string' && value.length === maxlen;
  }

  // Submit the form //////////////////////////////////////////////////////////

  // Retrieve all users to check if the email does not exist
  load() {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = structuredClone(res);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // To submit the form
  submit() {
    const FORM_VAL = this.userForm.value;

    if (!this.isEditMode || (this.isEditMode && this.userIni.email !== FORM_VAL.userEmail)) {
      // Check if the email does not exist
      this.load();
      if (this.users.some((user: User) => user.email === FORM_VAL.userEmail)) {
        alert('Cet e-mail existe déjà !');
        return;
      }
    }

    // Manage the checkboxes
    const INTERESTS: number[] = [];
    if (FORM_VAL.clothes) INTERESTS.push(EnumInterests.clothes);
    if (FORM_VAL.accessories) INTERESTS.push(EnumInterests.accessories);

    const USER = structuredClone(this.user);
    USER.additional = undefined; // Remove this property before saving

    if (this.isEditMode) {
      // Modify the user
      let toSave = false;

      const NAME = FORM_VAL.userName.trim().replace(/\s{2,}/g, ' ');
      if (this.userIni.name != NAME) {
        toSave = true;
        USER.name = NAME;
      }
      if (this.userIni.email !== FORM_VAL.userEmail) {
        toSave = true;
        USER.email = FORM_VAL.userEmail;
      }
      const GENDER = parseInt(FORM_VAL.gender);
      if (this.userIni.gender !== GENDER) {
        toSave = true;
        USER.gender = GENDER;
      }
      if (
        Interests.list.some(
          (item: any) =>
            this.userIni.interests.includes(item.value) !== INTERESTS.includes(item.value),
        )
      ) {
        toSave = true;
        USER.interests = INTERESTS;
      }
      const COUNTRY = parseInt(FORM_VAL.country);
      if (this.userIni.country !== COUNTRY) {
        toSave = true;
        USER.country = COUNTRY;
      }

      if (toSave) {
        // Update the user
        this.userService.updateUser(USER).subscribe({
          next: (res: Object) => {
            alert('Votre compte a été modifié.');
          },
          error: (err: any) => {
            alert("Une erreur s'est produite lors de la modification.");
            console.log(err);
          },
        });
      }
    } else {
      // Add the user
      USER.name = FORM_VAL.userName.trim().replace(/\s{2,}/g, ' ');
      USER.email = FORM_VAL.userEmail;
      USER.pswd = FORM_VAL.pswd;
      USER.gender = parseInt(FORM_VAL.gender);
      USER.interests = INTERESTS;
      USER.country = parseInt(FORM_VAL.country);

      this.userService.addUser(USER).subscribe({
        next: (res: Object) => {
          alert('Votre compte a été créé.');
          this.reset();
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la création.");
          console.log(err);
        },
      });
    }
  }

  // Reset the form ///////////////////////////////////////////////////////////
  reset() {
    this.userForm.reset();
    this.initFormValues();
  }

  // Go to the login form /////////////////////////////////////////////////////
  gotoLogin() {
    this.router.navigate([this.fromCart ? '/login-cart' : '/login']);
  }
}
