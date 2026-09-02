import { Common } from '../constants/common';

// Object containing the data allowing a user to log in
export type LoginData = { email: string; pswd: string };

// User class
export class User {
  id: string = '';
  reference: string = Common.getUserRef();
  dateIns: number = Date.now(); // Insertion date
  dateMod: number | null = null; // Modification date
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
    dateIns: number | null = null,
    dateMod: number | null = null,
    name: string | null = null,
    email: string | null = null,
    pswd: string | null = null,
    gender: number | null = null,
    interests: number[] | null = null,
    country: number | null = null,
  ) {
    if (typeof dateIns === 'number') this.dateIns = dateIns;
    if (typeof dateMod === 'number') this.dateMod = dateMod;
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
