import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScreenComponent } from './components/screen/screen.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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

  private interface?: MatDialogRef<InterfaceComponent>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.openInterface();
  }

  @HostListener('document:keydown.esc')
  toggleInterface(): void {
    if (!this.interface || this.interface.getState() === 2) {
      this.openInterface();
    }
  }

  openInterface(): void {
    this.interface = this.dialog.open(InterfaceComponent, { maxWidth: '80vw' });
  }

}
