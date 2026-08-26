import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';
import { Genders } from '../../constants/user-genders';
import { Interests } from '../../constants/user-interests';
import { Countries } from '../../constants/user-countries';

@Component({
  selector: 'app-user-view',
  imports: [RouterLink],
  templateUrl: './user-view.html',
  styleUrl: './user-view.css',
})
export class UserView {
  // Contants
  public Genders = Genders;
  public Interests = Interests;
  public Countries = Countries;

  // Native classes / Application services
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  // Class properties
  userId!: string | null;
  user: User = new User();

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
