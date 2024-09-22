import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipListbox, MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { StackService } from '../../services/stack.service';
import { InterfaceService } from '../../services/interface.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { selections } from '../../shared/selections';

@Component({
  selector: 'app-interface',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    DragDropModule,
    MatChipsModule,
  ],
  templateUrl: './interface.component.html',
  styleUrl: './interface.component.css'
})
export class InterfaceComponent implements OnInit {

  private destroy = new Subject();
  public stackSize = 0;

  @ViewChildren(MatChipListbox)
  listboxes?: QueryList<MatChipListbox>;

  constructor(
    public interfaceService: InterfaceService,
    public stackService: StackService,
  ) {}

  ngOnInit(): void {
    this.stackService.stack.pipe(takeUntil(this.destroy)).subscribe(stack => this.stackSize = stack.length);
  }

  selections_grouped = [
    { selection: selections.filter(selection => selection.group === 'Dreispitz'), label: 'Dreispitz' },
    { selection: selections.filter(selection => selection.group === 'Reinacher Heide'), label: 'Reinacher Heide' },
    { selection: selections.filter(selection => selection.group === 'Merian Gärten'), label: 'Merian Gärten' },
  ];

  deployments = [
    { deployment_id: 2808, label: 'Dreispitz: Cargo-Wagen im Zentrum' },
    { deployment_id: 1901, label: 'Dreispitz: Cargo-Wagen Richtung Bruderholz' },
    { deployment_id: 1132, label: 'Reinacher Heide: Fuchsbau' },
    { deployment_id: 273,  label: 'Reinacher Heide: Biber-Rutsche' },
    { deployment_id: 1072, label: 'Reinacher Heide: Trockenwiese' },
    { deployment_id: 974,  label: 'Reinacher Heide: Dorfbach' },
    { deployment_id: 3154, label: 'Merian Gärten: Birs-Kanalinsel 1' },
    { deployment_id: 3171, label: 'Merian Gärten: Birs-Kanalinsel 2' },
    { deployment_id: 3188, label: 'Merian Gärten: Birs-Kanalinsel 3' },
    { deployment_id: 883,  label: 'Merian Gärten/Dreispitz?: Blumentopf einer Bestäuber-Installation' },
    { deployment_id: 24,   label: 'Dreispitz: Veloparking-Dach' },
    { deployment_id: 67,   label: 'Dreispitz: Güterverkehr-Gleise' },
    { deployment_id: 820,  label: 'Reinacher Heide: Erlebnisweiher' },
    { deployment_id: 829,  label: 'Reinacher Heide: Erlebnisweiher' },
    { deployment_id: 824,  label: 'Reinacher Heide: Trockenwiese' },
    { deployment_id: 1184, label: 'Reinacher Heide: Trockenwiese' },
    { deployment_id: 1880, label: 'Dreispitz: Cargowagen InsektenKiosk' },
    { deployment_id: 202,  label: 'Reinacher Heide: Wildwechsel 1' },
    { deployment_id: 344,  label: 'Reinacher Heide: Wildwechsel 2' },
  ];

  intervals = [
    { seconds: undefined, label: 'not fixed' },
    { seconds: 15, label: '4/minute' },
    { seconds: 60, label: '1 minute' },
    { seconds: 600, label: '10 minutes' },
    { seconds: 3600, label: '1 hour' },
    { seconds: 3600*24, label: '1 day' },
    { seconds: 3600*24*7, label: '1 week' },
  ];

  framerates = [
    { rate: 1/10, label: '10s' },
    { rate: 1/2, label: '2s' },
    { rate: 1, label: '1/s' },
    { rate: 2, label: '2/s' },
    { rate: 5, label: '5/s' },
    { rate: 10, label: '10/s' },
  ];

  // select(selection: any): void {
  //   this.stackService.selectionCriteria.patchValue(selection);
  // }

  select(change: MatChipListboxChange): void {
    this.listboxes?.forEach(listbox => {
      if (listbox !== change.source) {
        listbox.value = [];
      }
    });
    this.stackService.selectionCriteria.patchValue(change.value);
  }
}
