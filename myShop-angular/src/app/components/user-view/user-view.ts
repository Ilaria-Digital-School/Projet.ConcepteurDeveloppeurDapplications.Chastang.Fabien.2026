import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { RoleList } from '../../models/role';
import { GenderList } from '../../models/gender';
import { InterestList } from '../../models/interest';
import { CountryList } from '../../models/country';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-user-view',
  imports: [RouterLink],
  templateUrl: './user-view.html',
  styleUrl: './user-view.css',
})
export class UserView {
  // Native classes / Application services
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  // Class properties
  userId!: string | null;
  user: User = new User();
  roles: RoleList = new RoleList();
  genders: GenderList = new GenderList();
  interests: InterestList = new InterestList();
  countries: CountryList = new CountryList();

  // Initialize the view
  ngOnInit() {
    // Retrieve the product
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userService.getUserById(this.userId).subscribe({
      next: (res: User) => {
        this.user = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
