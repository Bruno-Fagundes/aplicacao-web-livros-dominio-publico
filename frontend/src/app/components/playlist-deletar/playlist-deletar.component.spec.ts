import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistDeletarComponent } from './playlist-deletar.component';

describe('PlaylistDeletarComponent', () => {
  let component: PlaylistDeletarComponent;
  let fixture: ComponentFixture<PlaylistDeletarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistDeletarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistDeletarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
