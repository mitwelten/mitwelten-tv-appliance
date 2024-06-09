import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScreenComponent } from './components/screen/screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mitwelten-wildcam-tv';
}
