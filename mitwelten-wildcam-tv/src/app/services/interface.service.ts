import { Injectable } from '@angular/core';
import { InterfaceComponent } from '../components/interface/interface.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, filter, interval, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {

  private readonly counterMax = 100;
  private counter = 0;
  public remaining = new BehaviorSubject<number>(100);
  public interface?: MatDialogRef<InterfaceComponent>;

  constructor(private dialog: MatDialog) {
    const seconds = interval(100);
    seconds.pipe(
      filter(() => this.counter >= 0),
    ).subscribe(() => {
      this.remaining.next(this.counter);
      this.counter--;
      if (!this.counter) this.interface?.close();
    });
  }

  toggle(): void {
    if (!this.interface || this.interface.getState() === 2) {
      this.open();
    }
  }

  open(): void {
    this.counter = this.counterMax;
    this.interface = this.dialog.open(InterfaceComponent, { maxWidth: '80vw' });
  }

  resetTimeout(): void {
    this.counter = this.counterMax;
  }

}
