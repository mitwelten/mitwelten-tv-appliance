import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StackService } from '../../services/stack.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

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
    ReactiveFormsModule,
    DragDropModule
  ],
  templateUrl: './interface.component.html',
  styleUrl: './interface.component.css'
})
export class InterfaceComponent implements OnInit {

  private destroy = new Subject();
  public stackSize = 0;

  constructor(
    public stackService: StackService,
  ) {}

  ngOnInit(): void {
    this.stackService.stack.pipe(takeUntil(this.destroy)).subscribe(stack => this.stackSize = stack.length);
  }

  selections = [
    {
      deployment: 2808,
      period_start: new Date('2023-12-19'),
      period_end: new Date('2024-03-14'),
      title: 'Wagon Center',
      title_de: 'Cargo-Wagen im Zentrum',
      group: 'Dreispitz',
      framerate: 2,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 1901,
      period_start: new Date('2023-07-05'),
      period_end: new Date('2023-08-22'),
      title: 'Wagon Periphery 1',
      title_de: 'Cargo-Wagen Richtung Bruderholz 1',
      group: 'Dreispitz',
      framerate: 2,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 1901,
      period_start: new Date('2023-08-23'),
      period_end: new Date('2023-11-03'),
      title: 'Wagon Periphery 2',
      title_de: 'Cargo-Wagen Richtung Bruderholz 2',
      group: 'Dreispitz',
      framerate: 2,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 1901,
      period_start: new Date('2023-11-03'),
      period_end: new Date('2024-03-15'),
      title: 'Wagon Periphery 3',
      title_de: 'Cargo-Wagen Richtung Bruderholz 3',
      group: 'Dreispitz',
      framerate: 5,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 1132,
      period_start: new Date('2023-04-25'),
      period_end: new Date('2023-05-12'),
      title: 'Foxhole',
      title_de: 'Fuchsbau',
      group: 'Reinacher Heide',
      framerate: 2,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 273,
      period_start: new Date('2022-12-09'),
      period_end: new Date('2024-03-14'),
      title: 'Beaver Slide',
      title_de: 'Biber-Rutsche',
      group: 'Reinacher Heide',
      framerate: 1,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 1072,
      period_start: new Date('2023-02-14'),
      period_end: new Date('2023-04-24'),
      title: 'Dry Grassland 1',
      title_de: 'Trockenwiese',
      group: 'Reinacher Heide',
      framerate: 1,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 974,
      period_start: new Date('2023-04-26'),
      period_end: new Date('2023-06-28'),
      title: 'Village Creek',
      title_de: 'Dorfbach',
      group: 'Reinacher Heide',
      framerate: 1,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 3154,
      period_start: new Date('2017-03-18'),
      period_end: new Date('2017-03-27'),
      title: 'Channel Island 1',
      title_de: 'Birs-Kanalinsel 1',
      group: 'Merian Gärten',
      framerate: 0.5,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 3171,
      period_start: new Date('2019-07-24'),
      period_end: new Date('2019-09-13'),
      title: 'Channel Island 2',
      title_de: 'Birs-Kanalinsel 2',
      group: 'Merian Gärten',
      framerate: 0.5,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 3188,
      period_start: new Date('2020-09-23'),
      period_end: new Date('2020-10-25'),
      title: 'Channel Island 3',
      title_de: 'Birs-Kanalinsel 3',
      group: 'Merian Gärten',
      framerate: 0.5,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 883,
      period_start: new Date('2023-04-21'),
      period_end: new Date('2023-06-24'),
      title: 'Pollinator Flowerpot 1',
      title_de: 'Blumentopf einer Bestäuber-Installation',
      group: 'Merian Gärten',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 24,
      period_start: new Date('2022-05-12'),
      period_end: new Date('2022-08-09'),
      title: 'Pollinator Flowerpot 2',
      title_de: 'Blumentopf einer Bestäuber-Installation',
      group: 'Merian Gärten',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },

    {
      deployment: 24,
      period_start: new Date('2022-08-12'),
      period_end: new Date('2022-08-28'),
      title: 'Bike Parking Roof',
      title_de: 'Veloparking-Dach',
      group: 'Dreispitz',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 67,
      period_start: new Date('2022-08-15'),
      period_end: new Date('2022-08-28'),
      title: 'Closed Railway Tracks',
      title_de: 'Güterverkehr-Gleise',
      group: 'Dreispitz',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 820,
      period_start: new Date('2023-04-04'),
      period_end: new Date('2023-09-07'),
      title: 'Discovery Pond 1',
      title_de: 'Erlebnisweiher 1',
      group: 'Reinacher Heide',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 829,
      period_start: new Date('2023-04-04'),
      period_end: new Date('2023-06-26'),
      title: 'Discovery Pond 2',
      title_de: 'Erlebnisweiher 2',
      group: 'Reinacher Heide',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: 824,
      period_start: new Date('2023-04-04'),
      period_end: new Date('2023-07-19'),
      title: 'Dry Grassland 2',
      title_de: 'Trockenwiese 2',
      group: 'Reinacher Heide',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
  ]

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
  ];

  intervals = [
    { seconds: undefined, label: 'not fixed' },
    { seconds: 15, label: '4/Minute' },
    { seconds: 60, label: '1 Minute' },
    { seconds: 600, label: '10 Minuten' },
    { seconds: 3600, label: '1 Stunde' },
    { seconds: 3600*24, label: '1 Tag' },
    { seconds: 3600*24*7, label: '1 Woche' },
  ];

  framerates = [
    { rate: 1, label: '1/s' },
    { rate: 2, label: '2/s' },
    { rate: 5, label: '5/s' },
    { rate: 1/10, label: '10s' },
  ];

  select(selection: any): void {
    this.stackService.selectionCriteria.patchValue(selection);
  }
}
