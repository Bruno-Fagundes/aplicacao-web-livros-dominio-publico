import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistDetalhesComponent } from './playlist-detalhes.component';

describe('PlaylistDetalhesComponent', () => {
  let component: PlaylistDetalhesComponent;
  let fixture: ComponentFixture<PlaylistDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
