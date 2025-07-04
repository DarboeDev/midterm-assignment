import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPanelComponent } from './viewer-panel.component';

describe('ViewerPanelComponent', () => {
  let component: ViewerPanelComponent;
  let fixture: ComponentFixture<ViewerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewerPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
