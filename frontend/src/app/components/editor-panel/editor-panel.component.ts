// src/app/components/editor-panel/editor-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editor-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor-panel.component.html',
  styleUrls: ['./editor-panel.component.scss'],
})
export class EditorPanelComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
