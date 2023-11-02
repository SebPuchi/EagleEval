import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-bar',
  templateUrl: './home-bar.component.html',
  styleUrls: ['./home-bar.component.css'],
})
export class HomeBarComponent {
  constructor(private route: Router) {}
  backtoHome() {
    this.route.navigate(['/']);
  }
}
