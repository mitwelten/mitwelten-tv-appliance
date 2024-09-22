import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScreenComponent } from './components/screen/screen.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InterfaceComponent } from './components/interface/interface.component';
import { MatButtonModule } from '@angular/material/button';
import { InterfaceService } from './services/interface.service';
import { FreerunService } from './services/freerun.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScreenComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private interface?: MatDialogRef<InterfaceComponent>;

  constructor(
    private dialog: MatDialog,
    private interfaceService: InterfaceService,
    public freeRunService: FreerunService,
  ) {}

  ngOnInit(): void {
    // this.openInterface();
    this.freeRunService.trigger.subscribe(() => this.interfaceService.interface?.close());
    this.freeRunService.startCountdown();
  }

  @HostListener('document:keydown.esc')
  toggleInterface(): void {
    this.interfaceService.toggle();
  }

  openInterface(): void {
    this.interfaceService.open();
  }

}
