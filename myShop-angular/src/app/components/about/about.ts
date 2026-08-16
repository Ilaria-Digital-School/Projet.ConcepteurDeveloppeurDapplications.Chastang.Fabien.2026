import { Component } from '@angular/core';
import { AboutIntroduction } from "../about-introduction/about-introduction";
import { AboutInformation } from "../about-information/about-information";
import { AboutBenefits } from "../about-benefits/about-benefits";

@Component({
  selector: 'app-about',
  imports: [AboutIntroduction, AboutInformation, AboutBenefits],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
}
