import { Component } from '@angular/core';

@Component({
  selector: 'app-promotion',
  imports: [],
  templateUrl: './promotion.html',
  styleUrl: './promotion.css',
})
export class Promotion {
  // Class properties
  datePromo!: string;

  ngOnInit() {
    let date = new Date();
    date = new Date(date.setMonth(date.getMonth() + 1));
    date = new Date(date.getFullYear(), date.getMonth(), 0);
    this.datePromo = date.toLocaleDateString();
  }
}
