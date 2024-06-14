import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { ImageStack } from '../shared/image-stack.type';
import { StackImage } from '../shared/stack-image.type';
import { HttpClient } from '@angular/common/http';


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

  selectionCriteria: FormGroup = new FormGroup({
    deployment:    new FormControl<number|null>(null), // deployment id
    period_start:  new FormControl<Date|null>(null),
    period_end:    new FormControl<Date|null>(null),
    interval:      new FormControl<number>(1), // in seconds
    phases:        new FormArray([
      new FormGroup({
        phase_start: new FormControl<number>(0),  // in hours
        phase_end:   new FormControl<number>(24), // in hours
      }),
    ]),
  });

  constructor(
    private dataService: DataService,
    private http: HttpClient
  ) {
    this.selectionCriteria.valueChanges.subscribe(() => {
      if (this.selectionCriteria.valid) {
        this.loadStack();
      }
    });
  }

  loadStack(): void {
    // this.dataService.getImageStack(this.selectionCriteria.value).subscribe((stack: any) => {
    //   this.stack.next(stack);
    // });
    this.loadJsonFile();
  }

  loadJsonFile(): void {
    this.http.get('assets/imgstack.json').subscribe((data: any) => {
      // Process the data from the JSON file
      this.stack.next(data);
    });
  }
}
