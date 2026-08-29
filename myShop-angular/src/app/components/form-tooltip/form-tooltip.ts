import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form-tooltip',
  imports: [],
  templateUrl: './form-tooltip.html',
  styleUrl: './form-tooltip.css',
})
export class FormTooltip {
  // To retrieve DOM elements
  @ViewChild('infoText') infoText!: ElementRef;

  // To retrieve data from another component
  @Input() isSimple: any;
  @Input() helpHTML: any;

  ngAfterViewInit() {
    this.infoText.nativeElement.innerHTML = this.helpHTML;
  }
}
