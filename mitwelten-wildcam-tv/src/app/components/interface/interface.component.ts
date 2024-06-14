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
    { // total images: 499
      deployment: 2808,
      period_start: new Date('2023-12-19'),
      period_end: new Date('2024-03-14'),
      title: 'Dreispitz: Cargo-Wagen im Zentrum',
      framerate: 2,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    { // total images: 237
      deployment: 1901,
      period_start: new Date('2023-07-05'),
      period_end: new Date('2023-08-22'),
      title: 'Dreispitz: Cargo-Wagen Richtung Bruderholz',
      framerate: 2,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    { // total images: 335
      deployment: 1901,
      period_start: new Date('2023-04-25'),
      period_end: new Date('2023-07-06'),
      title: 'Dreispitz: Cargo-Wagen Richtung Bruderholz',
      framerate: 2,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    { // total images: 11821
      deployment: 1132,
      period_start: new Date('2023-04-25'),
      period_end: new Date('2023-05-10'),
      title: 'Reinacher Heide: Fuchsbau',
      framerate: 2,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    { // total images: 8864
      deployment: 273,
      period_start: new Date('2022-12-09'),
      period_end: new Date('2024-03-14'),
      title: 'Reinacher Heide: Biber-Rutsche ',
      framerate: 1,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    { // total images: 1364
      deployment: 1072,
      period_start: new Date('2023-02-14'),
      period_end: new Date('2023-04-24'),
      title: 'Reinacher Heide: Trockenwiese',
      framerate: 1,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    { // total images: 4979
      deployment: 974,
      period_start: new Date('2023-04-26'),
      period_end: new Date('2023-06-28'),
      title: 'Reinacher Heide: Dorfbach',
      framerate: 1,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    { // total images: 17
      deployment: -1,
      period_start: new Date('2020-03-18'),
      period_end: new Date('2020-03-27'),
      title: 'Merian Gärten: Birs-Kanalinsel 1',
      framerate: 0.5,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    { // total images: 45
      deployment: -1,
      period_start: new Date('2020-07-24'),
      period_end: new Date('2020-09-13'),
      title: 'Merian Gärten: Birs-Kanalinsel 2',
      framerate: 0.5,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    { // total images: 25
      deployment: -1,
      period_start: new Date('2020-09-23'),
      period_end: new Date('2020-10-25'),
      title: 'Merian Gärten: Birs-Kanalinsel 3',
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
      title: 'Merian Gärten/Dreispitz?: Blumentopf einer Bestäuber-Installation',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: -1,
      period_start: new Date('2022-05-12'),
      period_end: new Date('2022-08-09'),
      title: 'Dreispitz: Blumentopf einer Bestäuber-Installation',
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
      title: 'Dreispitz: Veloparking-Dach',
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
      title: 'Dreispitz: Güterverkehr-Gleise',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: -1,
      period_start: new Date('2023-04-04'),
      period_end: new Date('2023-09-07'),
      title: 'Reinacher Heide: Erlebnisweiher ',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: -1,
      period_start: new Date('2023-04-04'),
      period_end: new Date('2023-06-26'),
      title: 'Reinacher Heide: Erlebnisweiher ',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
    {
      deployment: -1,
      period_start: new Date('2023-04-04'),
      period_end: new Date('2023-07-19'),
      title: 'Reinacher Heide: Trockenwiese',
      framerate: 10,
      interval: undefined,
      phases: [
        { phase_start: 0, phase_end: 24 },
      ],
    },
  ]

  deployments = [
    { deployment_id: 2808, hidden: false, ref: '1234-6666_3S_CargoWagen_Insektenkiosk', label: 'Dreispitz: Cargo-Wagen im Zentrum' },
    { deployment_id: 1901, hidden: false, ref: '1234-7777_Cargowagen_Kim', label: 'Dreispitz: Cargo-Wagen Richtung Bruderholz' },
    { deployment_id: 1901, hidden: false, ref: '1234-7777_Cargowagen_Kim', label: 'Dreispitz: Cargo-Wagen Richtung Bruderholz' },
    { deployment_id: 1132, hidden: false, ref: '1234-7777_fuchsbau', label: 'Reinacher Heide: Fuchsbau' },
    { deployment_id: 273,  hidden: false, ref: '1234-8888_biberrutsche', label: 'Reinacher Heide: Biber-Rutsche' },
    { deployment_id: 1072, hidden: false, ref: '1234-9999', label: 'Reinacher Heide: Trockenwiese' },
    { deployment_id: 974,  hidden: false, ref: '?', label: 'Reinacher Heide: Dorfbach' },
    { deployment_id: -1,   hidden: true,  ref: '20200417_Dyych_Biber', label: 'Merian Gärten: Birs-Kanalinsel 1' },
    { deployment_id: -1,   hidden: true,  ref: '20191004_DyychInsel', label: 'Merian Gärten: Birs-Kanalinsel 2' },
    { deployment_id: -1,   hidden: true,  ref: '20201030_Dyychinsel_Kauz-Biber_Fuchs_Dachs_Reiher', label: 'Merian Gärten: Birs-Kanalinsel 3' },
    { deployment_id: -1,   hidden: true,  ref: '(PiCam Merian Gärten)', label: 'Merian Gärten: Blumentopf einer Bestäuber-Installation' },
    { deployment_id: 883,  hidden: false, ref: 'PiCam 1610-4826 (Insektenkiosk)', label: 'Merian Gärten/Dreispitz?: Blumentopf einer Bestäuber-Installation' },
    { deployment_id: -1,   hidden: true,  ref: 'PiCam 5605-3691 (Velodach)', label: 'Dreispitz: Blumentopf einer Bestäuber-Installation' },
    { deployment_id: 24,   hidden: false, ref: 'PiCam 5605-3691', label: 'Dreispitz: Veloparking-Dach' },
    { deployment_id: 67,   hidden: false, ref: 'PiCam 3200-5010', label: 'Dreispitz: Güterverkehr-Gleise' },
    { deployment_id: -1,   hidden: true,  ref: 'PiCam 2990-0522', label: 'Reinacher Heide: Erlebnisweiher' },
    { deployment_id: -1,   hidden: true,  ref: 'PiCam 0125-4959', label: 'Reinacher Heide: Erlebnisweiher' },
    { deployment_id: -1,   hidden: true,  ref: 'PiCam 4619-0296', label: 'Reinacher Heide: Trockenwiese' },
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
    { rate: 10, label: '10s' },
  ];

  select(selection: any): void {
    this.stackService.selectionCriteria.patchValue(selection);
  }
}
