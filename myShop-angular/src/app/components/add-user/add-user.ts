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
import { User } from '../../models/user';
import { Interest, InterestList } from '../../models/interest';
import { UserService } from '../../services/user-service';
import { FormTooltip } from '../form-tooltip/form-tooltip';
import { CountryList } from '../../models/country';
import { GenderList } from '../../models/gender';
// import { JsonPipe } from '@angular/common';

// Custom validators for the entire form //////////////////////////////////////

export class CustomValidators {
  // Confirm password
  static confirmPswd(control: AbstractControl): ValidationErrors | null {
    const [PSWD, CONFIRM] = [control.get('pswd')?.value, control.get('confirm')?.value];
    return PSWD !== CONFIRM ? { pswdMismatch: true } : null;
  }
}

const HELP_HTML = `
Les champs marqués d'un astérisque (<span style="color: red; padding: 0 3px">*</span>) sont
obligatoires.
`;

// Component //////////////////////////////////////////////////////////////////

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, FormTooltip /*, JsonPipe*/],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {
  // Native classes / Application services
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  // Class properties
  userForm!: FormGroup;
  genders: GenderList = new GenderList();
  interests: InterestList = new InterestList();
  countries: CountryList = new CountryList();
  isEditMode!: boolean;
  userId!: string | null;
  title!: string;
  btnAction!: string;
  user: User = new User();
  userIni: User = new User();
  isNewEmail!: boolean;
  fromCart!: boolean;
  fromTable!: boolean;
  valuesChange: boolean = false;
  helpHTML: string = HELP_HTML;

  // Initialization ///////////////////////////////////////////////////////////

  // Form definition and validation, and data initialization
  ngOnInit() {
    // Origin of the page request
    this.fromCart = this.router.url.includes('add-user-cart');
    this.fromTable = this.router.url.includes('edit-user-table');

    // Get user ID if it exists
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEditMode = this.userId ? true : false;
    const RE_NAME = /(.{0,}\S.{0,}){3,}/;

    if (this.isEditMode) {
      // Edit mode: retrieve the user by its ID ///////////

      this.title = 'Mise à jour';
      this.btnAction = 'Modifier';

      // Form validation
      this.userForm = this.formBuilder.group({
        userName: ['', [Validators.required, Validators.pattern(RE_NAME)]],
        userEmail: ['', [Validators.required, Validators.email]],
        gender: [0],
        clothes: [false],
        accessories: [false],
        country: [0],
      });

      this.userService.getUserById(this.userId).subscribe({
        next: (res: User) => {
          this.user = res;
          this.userIni = res;
          this.initFormValues();
        },
        error: (err: any) => {
          console.log(err);
        },
      });

      // To detect changes
      this.userForm.valueChanges.subscribe((formValue: any) => {
        if (formValue.userName !== null) {
          this.valuesChange =
            formValue.userName.trim() !== this.userIni.name ||
            formValue.userEmail !== this.userIni.email ||
            formValue.gender !== this.userIni.gender ||
            formValue.clothes !== this.userIni.interests.includes(this.interests.objectValues.clothes) ||
            formValue.accessories !==
              this.userIni.interests.includes(this.interests.objectValues.accessories) ||
            parseInt(formValue.country) !== this.userIni.country;
        }
      });
    } else {
      // Add a new user ///////////////////////////////////

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
        gender: [0],
        clothes: [false],
        accessories: [false],
        country: [0],
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
      gender: this.userIni.gender,
      clothes: this.userIni.interests.includes(this.interests.objectValues.clothes),
      accessories: this.userIni.interests.includes(this.interests.objectValues.accessories),
      country: this.userIni.country,
    });
  }

  // Edit mode: to notify of a change
  hasChanged(): boolean {
    return this.valuesChange;
  }

  // Check the maximum length to inform the user
  warningMaxlength(value: string, maxlen: number): boolean {
    return typeof value === 'string' && value.length === maxlen;
  }

  // Actions //////////////////////////////////////////////////////////////////

  // Retrieve all users to check if the email does not exist
  checkNewEmail(email: string) {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        if (res.some((user: User) => user.email === email)) {
          alert('Cet e-mail existe déjà !');
          this.isNewEmail = false;
        } else {
          this.isNewEmail = true;
        }
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
        this.isNewEmail = false;
      },
    });
  }

  // To submit the form
  submit() {
    const FORM_VAL = this.userForm.value;

    // Check if the email does not exist
    if (!this.isEditMode || (this.isEditMode && this.userIni.email !== FORM_VAL.userEmail)) {
      this.checkNewEmail(FORM_VAL.userEmail);
      if (!this.isNewEmail) return;
    }

    // Manage the checkboxes
    const INTERESTS: number[] = [];
    if (FORM_VAL.clothes) INTERESTS.push(this.interests.objectValues.clothes);
    if (FORM_VAL.accessories) INTERESTS.push(this.interests.objectValues.accessories);

    const USER = new User();
    Object.assign(USER, this.user);

    if (this.isEditMode) {
      // Modify the user //////////////////////////////////

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
      const GENDER = FORM_VAL.gender;
      if (this.userIni.gender !== GENDER) {
        toSave = true;
        USER.gender = GENDER;
      }
      if (
        this.interests.values.some(
          (i: Interest) => this.userIni.interests.includes(i.value) !== INTERESTS.includes(i.value),
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
          next: (res: User) => {
            if (this.fromTable) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/user-view', this.userId]);
            }
          },
          error: (err: any) => {
            alert("Une erreur s'est produite lors de la modification.");
            console.log(err);
          },
        });
      }
    } else {
      // Add the user /////////////////////////////////////

      USER.name = FORM_VAL.userName.trim().replace(/\s{2,}/g, ' ');
      USER.email = FORM_VAL.userEmail;
      USER.pswd = FORM_VAL.pswd;
      USER.gender = FORM_VAL.gender;
      USER.interests = INTERESTS;
      USER.country = parseInt(FORM_VAL.country);

      this.userService.addUser(USER).subscribe({
        next: (res: User) => {
          alert('Votre compte a été créé.');
          this.gotoLogin();
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la création.");
          console.log(err);
        },
      });
    }
  }

  // Reset the form
  reset() {
    this.userForm.reset();
    this.initFormValues();
  }

  // Go to the login form
  gotoLogin() {
    this.router.navigate([this.fromCart ? '/user-login-cart' : '/user-login']);
  }
}
