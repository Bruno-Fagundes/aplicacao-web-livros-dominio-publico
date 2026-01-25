import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistAdicionarLivroComponent } from './playlist-adicionar-livro.component';

describe('PlaylistAdicionarLivroComponent', () => {
  let component: PlaylistAdicionarLivroComponent;
  let fixture: ComponentFixture<PlaylistAdicionarLivroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistAdicionarLivroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistAdicionarLivroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
