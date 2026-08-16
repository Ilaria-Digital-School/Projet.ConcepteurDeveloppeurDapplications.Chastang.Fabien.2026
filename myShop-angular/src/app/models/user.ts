import { Common } from '../constants/common';
import { Genders } from '../constants/genders';
import { Interests } from '../constants/interests';
import { Countries } from '../constants/countries';
import { Roles } from '../constants/roles';

// User class
export class User {
  id: string = Common.getID();
  name: string = '';
  email: string = '';
  pswd: string = '';
  gender: number = Genders.other.value;
  interests: number[] = [];
  country: number = Countries.other.value;
  role: number = Roles.other.value;
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
    if (typeof gender === 'number') {
      const GENDER: any = Genders.list.find((item: any) => item.value === gender);
      this.gender = GENDER ? GENDER.value : Genders.other.value;
    }
    if (Array.isArray(interests)) {
      this.interests = Interests.list
        .filter((item: any) => interests.includes(item.value))
        .map((item: any) => item.value);
    }
    if (typeof country === 'number') {
      const COUNTRY: any = Countries.list.find((item: any) => item.value === country);
      this.country = COUNTRY ? COUNTRY.value : Countries.other.value;
    }
  }
}
