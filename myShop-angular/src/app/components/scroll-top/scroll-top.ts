import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  imports: [],
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.css',
})
export class ScrollTop {
  // Class properties
  isVisible: boolean = false;

  // Decorator that declares a DOM event to listen for
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Displays the button as soon as the user scrolls down the page
    this.isVisible = window.scrollY > 0;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth animation
    });
  }
}
