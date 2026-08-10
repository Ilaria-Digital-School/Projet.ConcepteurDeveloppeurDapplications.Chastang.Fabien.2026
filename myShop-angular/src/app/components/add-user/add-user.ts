import {
  Component,
  inject,
  Renderer2,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
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
  imports: [ReactiveFormsModule/*, JsonPipe*/],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser implements AfterViewInit {
  // The list of genders: initialized in the 'ngAfterViewInit' method
  @ViewChild('genders') gendersDiv!: ElementRef;
  gendersHTMLInput!: NodeListOf<HTMLInputElement>;

  // General component management
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private renderer = inject(Renderer2); // To retrieve the HTML elements, in this class, the HTML tags <select>
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private userService = inject(UserService);

  // The list of countries ////////////////////////////////////////////////////
  
  countriesHTMLSelect!: HTMLSelectElement;
  countriesHTMLOptions!: HTMLOptionsCollection; // Initialized in the 'ngAfterViewInit' method

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
  userId!: string | null;
  title!: string;
  btnAction!: string;
  users: User[] = [];
  user: User = new User();
  interests: number[] = [];
  userIni: User = new User();
  interestsIni: number[] = [];
  fromCart!: boolean;

  // Initialize the form
  ngOnInit(): void {
    // Origin of the page request
    this.fromCart = this.router.url.includes('add-user-cart');

    // Populating the HTML <select> element for countries
    this.setCountries();

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
          if (this.user.interests) {
            this.interests = JSON.parse(this.user.interests);
            this.interestsIni = structuredClone(this.interests);
          }
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
      nameItem: [
        this.userIni.name,
        [Validators.required, Validators.pattern(/\S{3,}/), Validators.maxLength(50)],
      ],
      email: [this.userIni.email, [Validators.required, Validators.email]],
      pswd: [this.userIni.pswd, [Validators.required, Validators.pattern(PSWD_PATTERN)]],
      confirm: [this.userIni.pswd, Validators.required],
      gender: [this.userIni.gender.toString()],
      clothes: [this.interestsIni.includes(1)],
      accessories: [this.interestsIni.includes(2)],
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

    if (!this.isEditMode || (this.isEditMode && this.userIni.email !== FORM_VAL.email)) {
      // Check if the email does not exist
      this.load();
      if (this.users.some((user: User) => user.email === FORM_VAL.email)) {
        alert('Cet e-mail existe déjà !');
        return;
      }
    }

    // Manage the checkboxes
    let interests: number[] = [];
    if (FORM_VAL.clothes) interests.push(1);
    if (FORM_VAL.accessories) interests.push(2);

    if (this.isEditMode) {
      // Modify the user
      let toSave: boolean = false;

      const NAME = FORM_VAL.nameItem.trim();
      if (this.userIni.name != NAME) {
        toSave = true;
        this.user.name = NAME;
      }
      if (this.userIni.email !== FORM_VAL.email) {
        toSave = true;
        this.user.email = FORM_VAL.email;
      }
      const GENDER = parseInt(FORM_VAL.gender);
      if (this.userIni.gender !== GENDER) {
        toSave = true;
        this.user.gender = GENDER;
      }
      if (
        Interests.list.some(
          (item: any) => this.interestsIni.includes(item.value) !== interests.includes(item),
        )
      ) {
        toSave = true;
        this.user.interests = JSON.stringify(interests);
      }
      const COUNTRY: number = parseInt(FORM_VAL.country);
      if (this.userIni.country !== COUNTRY) {
        toSave = true;
        this.user.country = COUNTRY;
      }

      if (toSave) {
        // Update the user
        this.userService.updateUser(this.user).subscribe({
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
      this.user.name = FORM_VAL.nameItem.trim();
      this.user.email = FORM_VAL.email;
      this.user.pswd = FORM_VAL.pswd;
      this.user.gender = parseInt(FORM_VAL.gender);
      this.user.interests = JSON.stringify(interests);
      this.user.country = parseInt(FORM_VAL.country);

      this.userService.addUser(this.user).subscribe({
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
    if (this.isEditMode) {
      // Edit mode
      this.userForm.patchValue({
        nameItem: this.userIni.name,
        email: this.userIni.email,
        gender: this.userIni.gender.toString(),
        clothes: this.interestsIni.includes(1),
        accessories: this.interestsIni.includes(2),
        country: this.userIni.country.toString(),
      });
    } else {
      this.userForm.reset();
      this.gendersHTMLInput[2].checked = true;
      this.countriesHTMLOptions[this.countriesHTMLOptions.length - 1].selected = true;
    }
  }

  // Go to the login form /////////////////////////////////////////////////////
  gotoLogin() {
    this.router.navigate([this.fromCart ? '/login-cart' : '/login']);
  }
}
