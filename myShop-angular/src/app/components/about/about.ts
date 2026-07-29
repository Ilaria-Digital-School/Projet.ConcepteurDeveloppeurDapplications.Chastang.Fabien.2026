import { DatePipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TransformPipe } from '../../pipes/transform-pipe';

@Component({
  selector: 'app-about',
  imports: [UpperCasePipe, LowerCasePipe, DatePipe, TransformPipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  now: Date = new Date();
}
