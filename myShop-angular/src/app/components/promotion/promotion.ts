import { Component } from '@angular/core';

@Component({
  selector: 'app-promotion',
  imports: [],
  templateUrl: './promotion.html',
  styleUrl: './promotion.css',
})
export class Promotion {
  saleDate!: string;

  ngOnInit() {
    let datePromo = new Date();
    datePromo = new Date(datePromo.setMonth(datePromo.getMonth() + 1));
    datePromo = new Date(datePromo.getFullYear(), datePromo.getMonth(), 0);
    this.saleDate = datePromo.toLocaleDateString();
  }
}
