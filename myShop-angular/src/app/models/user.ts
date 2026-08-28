import { Common } from '../constants/common';
import { UserGenders } from '../constants/user-genders';
import { UserInterests } from '../constants/user-interests';
import { UserCountries } from '../constants/user-countries';
import { UserRoles } from '../constants/user-roles';

// User class
export class User {
  id: string = '';
  reference: string = Common.getUserRef();
  name: string = '';
  email: string = '';
  pswd: string = '';
  gender: number = UserGenders.other.value;
  interests: number[] = [];
  country: number = UserCountries.other.value;
  role: number = UserRoles.other.value;
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
      const GENDER: any = UserGenders.list.find((item: any) => item.value === gender);
      this.gender = GENDER ? GENDER.value : UserGenders.other.value;
    }
    if (Array.isArray(interests)) {
      this.interests = UserInterests.list
        .filter((item: any) => interests.includes(item.value))
        .map((item: any) => item.value);
    }
    if (typeof country === 'number') {
      const COUNTRY: any = UserCountries.list.find((item: any) => item.value === country);
      this.country = COUNTRY ? COUNTRY.value : UserCountries.other.value;
    }
  }

  // Remove these properties before saving the user
  removeBeforeSaveUser(): User {
    const USER = new User();
    Object.assign(USER, this);
    delete USER.additional;
    return USER;
  }
}
