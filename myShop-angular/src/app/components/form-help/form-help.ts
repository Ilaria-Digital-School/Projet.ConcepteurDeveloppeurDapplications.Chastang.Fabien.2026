import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form-help',
  imports: [],
  templateUrl: './form-help.html',
  styleUrl: './form-help.css',
})
export class FormHelp {
  @ViewChild('infoText') infoText!: ElementRef;
  @Input() isSimple: any;
  @Input() helpHTML: any;

  ngAfterViewInit() {
    this.infoText.nativeElement.innerHTML = this.helpHTML;
  }
}
