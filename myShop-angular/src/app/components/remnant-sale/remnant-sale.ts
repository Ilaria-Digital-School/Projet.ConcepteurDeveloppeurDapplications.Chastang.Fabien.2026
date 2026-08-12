import { Component } from '@angular/core';

@Component({
  selector: 'app-remnant-sale',
  imports: [],
  templateUrl: './remnant-sale.html',
  styleUrl: './remnant-sale.css',
})
export class RemnantSale {
  saleDate!: string;

  ngOnInit() {
    let datePromo = new Date();
    datePromo = new Date(datePromo.setMonth(datePromo.getMonth() + 1));
    datePromo = new Date(datePromo.getFullYear(), datePromo.getMonth(), 0);
    this.saleDate = datePromo.toLocaleDateString();
  }
}
