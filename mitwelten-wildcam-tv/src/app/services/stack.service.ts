import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, distinctUntilChanged, map, tap } from 'rxjs';
import { StackImage } from '../shared/stack-image.type';
import { HttpClient } from '@angular/common/http';
import { StackQuery } from '../shared/stack-query.type';
import { InterfaceService } from './interface.service';
import { FreerunService } from './freerun.service';
import { selections } from '../shared/selections';


@Injectable({
  providedIn: 'root'
})
/**
 * Service for managing the image stack.
 *
 * The stack is a collection of images that are loaded and displayed in a seamless loop.
 *
 * - Selection criteria are defined in a form and submitted to the stack service
 * - The stack service retrieves the images from the data service
 * - The stack service also returns metadata for the images, like the image size,
 *   actual date range, dimensions, etc.
 *
 */
export class StackService {

  public stack: ReplaySubject<StackImage[]> = new ReplaySubject<StackImage[]>();
  public framerate: ReplaySubject<number> = new ReplaySubject<number>(1);
  public landscape: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public loading: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  selectionCriteria: FormGroup = new FormGroup({
    deployment:    new FormControl<number|null>(null), // deployment id
    period_start:  new FormControl<Date|null>(null),
    period_end:    new FormControl<Date|null>(null),
    interval:      new FormControl<number>(1), // in seconds
    phase:         new FormControl<'day'|'night'|null>(null),
    // phases:        new FormArray([
    //   new FormGroup({
    //     phase_start: new FormControl<number>(0),  // in hours
    //     phase_end:   new FormControl<number>(24), // in hours
    //   }),
    // ]),
    framerate:     new FormControl<number>(1), // in frames per second
    landscape:     new FormControl<boolean>(true),
  });

  constructor(
    private dataService: DataService,
    private interfaceService: InterfaceService,
    private freeRunService: FreerunService,
    private http: HttpClient
  ) {
    this.selectionCriteria.valueChanges.pipe(
      tap(() => this.interfaceService.resetTimeout()),
      tap(() => {
        this.framerate.next(this.selectionCriteria.value.framerate);
        this.landscape.next(this.selectionCriteria.value.landscape);
      }),
      distinctUntilChanged((a, b) => {
        const { framerate: framerateA, landscape: landscapeA, ...restA } = a;
        const { framerate: framerateB, landscape: landscapeB, ...restB } = b;
        return JSON.stringify(restA) === JSON.stringify(restB);
      })
    ).subscribe(() => {
      if (this.selectionCriteria.valid) {
        this.loadStack();
      }
    });

    this.freeRunService.trigger.subscribe(() => {
      const randomSelection = selections[Math.floor(Math.random() * selections.length)];
      this.selectionCriteria.patchValue(randomSelection);
    });
  }

  loadStack(): void {
    const query = this.selectionCriteria.value;
    const translatedQuery: StackQuery = {
      deployment_id: query.deployment,
      period: {
        start: query.period_start?.toISOString(),
        end: query.period_end?.toISOString()
      },
      interval: query.interval,
      phase: query.phase,
    };
    this.loading.next(true);
    this.dataService.getImageStack(translatedQuery).subscribe({
      next: (stack) => {
        this.loading.next(false);
        this.stack.next(stack);
      },
      error: () => {
        this.loading.next(false);
      }});
  }

  loadJsonFile(): void {
    this.http.get('assets/imgstack.json').subscribe((data: any) => {
      // Process the data from the JSON file
      this.stack.next(data);
    });
  }
}
