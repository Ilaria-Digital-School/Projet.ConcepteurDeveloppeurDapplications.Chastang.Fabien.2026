import { Common } from '../constants/common';

// Object containing the data allowing a user to log in
export type LoginData = { email: string; pswd: string };

// User class
export class User {
  id: string = '';
  reference: string = Common.getUserRef();
  name: string = '';
  email: string = '';
  pswd: string = '';
  gender: number = 0;
  interests: number[] = [];
  country: number = 0;
  role: number = 0;
  visible: boolean = true;

  // Temporary property, not saved
  additional: any = {}; // For additional properties (RxJS) while preserving the 'User' type

  constructor(
    name: string | null = null,
    email: string | null = null,
    pswd: string | null = null,
    gender: number | null = null,
    interests: number[] | null = null,
    country: number | null = null,
  ) {
    if (typeof name === 'string') this.name = name;
    if (typeof email === 'string') this.email = email;
    if (typeof pswd === 'string') this.pswd = pswd;
    if (typeof gender === 'number') this.gender = gender;
    if (Array.isArray(interests)) this.interests = interests;
    if (typeof country === 'number') this.country = country;
  }

  // Remove these properties before saving the user
  removeBeforeSaveUser(): User {
    const USER = new User();
    Object.assign(USER, this);
    delete USER.additional;
    return USER;
  }
}
