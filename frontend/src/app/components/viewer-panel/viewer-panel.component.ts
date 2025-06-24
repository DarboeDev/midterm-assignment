// src/app/components/viewer-panel/viewer-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viewer-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewer-panel.component.html',
  styleUrls: ['./viewer-panel.component.scss'],
})
export class ViewerPanelComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
