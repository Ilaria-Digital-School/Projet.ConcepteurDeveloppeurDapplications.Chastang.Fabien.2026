import { Component } from '@angular/core';
import { UsersData } from '../../../data/users-data';
import { Countries } from '../../../data/countries';
import { Genders } from '../../../data/genders';
import { Roles } from '../../../data/roles';

@Component({
  selector: 'app-users-table',
  imports: [],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css',
})
export class UsersTable extends UsersData {
  countries:any = new Countries();
  genders:any = new Genders();
  roles:any = new Roles();
}
