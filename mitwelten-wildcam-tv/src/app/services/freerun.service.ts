import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FreerunService {

  private countdownTimer?: ReturnType<typeof setInterval> | null;
  private countdownValue: number = 0;
  private maxSeconds: number = 5 * 60;

  public countdown: Subject<number> = new Subject<number>();
  public trigger: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  startCountdown(seconds?: number): void {
    this.maxSeconds = seconds || this.maxSeconds;
    this.resetCountdown(this.maxSeconds);
    this.resumeCountdown();
  }

  resetCountdown(seconds?: number): void {
    this.maxSeconds = seconds || Math.random() * 4 * 60 + 60;
    this.countdownValue = this.maxSeconds;
  }

  pauseCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  resumeCountdown(): void {
    if (!this.countdownTimer) {
      this.countdownTimer = setInterval(() => {
        this.countdownValue--;
        this.countdown.next(this.countdownValue);
        if (this.countdownValue <= 0) {
          this.countdown.next(0);
          this.trigger.next(0);
          this.resetCountdown();
        }
      }, 1000);
    }
  }

}
