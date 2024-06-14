import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScreenComponent } from './components/screen/screen.component';
import { MatDialog } from '@angular/material/dialog';
import { InterfaceComponent } from './components/interface/interface.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScreenComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.openInterface();
  }

  openInterface(): void {
    this.dialog.open(InterfaceComponent, { maxWidth: '80vw' });
  }

}
