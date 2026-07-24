import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  title: string = 'My Shop';
  name!: string; // Without initialization
  var!: any; // Any type, mainly for objects and data originating from the database

  // Method
  sum(a: number, b: number) {
    return a + b;
  }
}
