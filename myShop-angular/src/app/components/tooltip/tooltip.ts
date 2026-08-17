import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.css',
})
export class Tooltip {
  // To retrieve DOM elements
  @ViewChild('infoText') infoText!: ElementRef;

  // To retrieve data from another component
  @Input() isSimple: any;
  @Input() helpHTML: any;

  ngAfterViewInit() {
    this.infoText.nativeElement.innerHTML = this.helpHTML;
  }
}
