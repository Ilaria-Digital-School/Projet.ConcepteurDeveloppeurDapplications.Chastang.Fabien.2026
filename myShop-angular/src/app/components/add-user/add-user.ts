import { Component, inject, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Countries, Interests, User } from '../../../main';
import { UserService } from '../../services/user-service';
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
  imports: [ReactiveFormsModule /*, JsonPipe*/],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {
  Countries = Countries;

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private userService = inject(UserService);

  userForm!: FormGroup;
  isEditMode!: boolean;
  userId!: string | null;
  title!: string;
  btnAction!: string;
  users: User[] = [];
  user: User = new User();
  userIni: User = new User();
  fromCart!: boolean;
  intervalId: number = 0;

  // The form and its data: initialization and validation /////////////////////

  // Initialize the form
  ngOnInit(): void {
    // Origin of the page request
    this.fromCart = this.router.url.includes('add-user-cart');

    // Get user ID if it exists
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEditMode = this.userId ? true : false;

    if (this.isEditMode) {
      // Edit mode: retrieve the user by its ID
      this.title = 'Mise à jour';
      this.btnAction = 'Modifier';

      this.userService.getUserById(this.userId).subscribe({
        next: (res: User) => {
          Object.assign(this.user, res);
          Object.assign(this.userIni, res);
          this.changeDetectorRef.detectChanges(); // Asynchrone process: force a check
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    } else {
      // Add a new user
      this.title = 'Inscription';
      this.btnAction = 'Ajouter';
    }

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

    // Form initialization and field validation setup
    this.userForm = this.formBuilder.group({
      userName: [
        this.userIni.name,
        [Validators.required, Validators.pattern(/\S{3,}/), Validators.maxLength(50)],
      ],
      userEmail: [this.userIni.email, [Validators.required, Validators.email]],
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

  // To submit the form ///////////////////////////////////////////////////////

  // Retrieve all users to check if the email does not exist
  load(forceCheck: boolean = false): void {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = structuredClone(res);
        if (forceCheck) this.changeDetectorRef.detectChanges(); // Force a check
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // To submit the form
  submit(): void {
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
    if (FORM_VAL.clothes) INTERESTS.push(1);
    if (FORM_VAL.accessories) INTERESTS.push(2);

    const USER = structuredClone(this.user);
    USER.additional = undefined; // Remove this property before saving

    if (this.isEditMode) {
      // Modify the user
      let toSave: boolean = false;

      const NAME = FORM_VAL.userName.trim();
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
          (item: any) => this.userIni.interests.includes(item.value) !== INTERESTS.includes(item),
        )
      ) {
        toSave = true;
        USER.interests = INTERESTS;
      }
      const COUNTRY: number = parseInt(FORM_VAL.country);
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
      USER.name = FORM_VAL.userName.trim();
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

  // To reset the form ////////////////////////////////////////////////////////
  reset(): void {
    this.userForm.reset();
    this.userForm.patchValue({
      userName: this.userIni.name,
      userEmail: this.userIni.email,
      gender: this.userIni.gender.toString(),
      clothes: this.userIni.interests.includes(1),
      accessories: this.userIni.interests.includes(2),
      country: this.userIni.country.toString(),
    });
  }

  // Go to the login form /////////////////////////////////////////////////////
  gotoLogin() {
    this.router.navigate([this.fromCart ? '/login-cart' : '/login']);
  }
}
