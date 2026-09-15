import { Common } from '../constants/common';

// Object containing the data allowing a user to log in
export type LoginData = { email: string; pswd: string };

// Token returned by the backend
export type Token = { token: string };

// Token payload after decoding
export class TokenPayload {
  // User informations
  id: string = '';
  name: string = '';
  role: number = 0;
}

// User class
export class User {
  _id: string = '';
  reference: string = Common.getUserRef();
  dateIns: Date = new Date(Date.now()); // Insertion date
  dateMod: Date | null = null; // Modification date
  name: string = '';
  email: string = '';
  pswd: string = '';
  gender: number = 0;
  interests: number[] = [];
  country: number = 0;
  role: number = 0;
  dateVisible: Date | null = null; // Date on which the data was show or hidden
  visible: boolean = true;

  // Temporary property, not saved
  additional: any = {}; // For additional properties (RxJS) while preserving the 'User' type

  constructor(
    dateIns: Date | null = null,
    dateMod: Date | null = null,
    name: string | null = null,
    email: string | null = null,
    pswd: string | null = null,
    gender: number | null = null,
    interests: number[] | null = null,
    country: number | null = null,
  ) {
    if (dateIns instanceof Date) this.dateIns = dateIns;
    if (dateMod instanceof Date) this.dateMod = dateMod;
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
