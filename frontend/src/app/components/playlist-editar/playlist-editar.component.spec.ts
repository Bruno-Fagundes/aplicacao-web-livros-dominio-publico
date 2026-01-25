import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistEditarComponent } from './playlist-editar.component';

describe('PlaylistEditarComponent', () => {
  let component: PlaylistEditarComponent;
  let fixture: ComponentFixture<PlaylistEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
