import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { RoleList } from '../../models/role';
import { GenderList } from '../../models/gender';
import { InterestList } from '../../models/interest';
import { CountryList } from '../../models/country';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-view',
  imports: [RouterLink],
  templateUrl: './user-view.html',
  styleUrl: './user-view.css',
})
export class UserView {
  // Native classes / Application services
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  // User messages
  private static msgDelUser: string = 'Êtes-vous sûr de vouloir supprimer votre compte ?';

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

  // Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Delete a user
  remove(id: string) {
    // Confirmaton message to delete the user
    if (confirm(UserView.msgDelUser)) {
      // Remove the user
      this.userService.deleteUser(id).subscribe({
        next: (res: User) => {
          this.logout();
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la suppression.");
          console.log(err);
        },
      });
    }
  }
}
