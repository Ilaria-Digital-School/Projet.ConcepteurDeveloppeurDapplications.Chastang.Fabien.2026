import { Component } from '@angular/core';
import { UsersData } from '../../../assets/ts/users-data';
import { Countries } from '../../../assets/ts/countries';
import { Genders } from '../../../assets/ts/genders';
import { Roles } from '../../../assets/ts/roles';

@Component({
  selector: 'app-users-table',
  imports: [],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css',
})
export class UsersTable extends UsersData {
  genders: any = new Genders();
  countries: any = new Countries();
  roles: any = new Roles();
}
