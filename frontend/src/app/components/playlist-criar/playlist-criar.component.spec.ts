import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistCriarComponent } from './playlist-criar.component';

describe('PlaylistCriarComponent', () => {
  let component: PlaylistCriarComponent;
  let fixture: ComponentFixture<PlaylistCriarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistCriarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistCriarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
