import { Component } from '@angular/core';

@Component({
  selector: 'app-home-promotion',
  imports: [],
  templateUrl: './home-promotion.html',
  styleUrl: './home-promotion.css',
})
export class HomePromotion {
  // Class properties
  datePromo!: string;

  ngOnInit() {
    let date = new Date();
    date = new Date(date.setMonth(date.getMonth() + 1));
    date = new Date(date.getFullYear(), date.getMonth(), 0);
    this.datePromo = date.toLocaleDateString();
  }
}
