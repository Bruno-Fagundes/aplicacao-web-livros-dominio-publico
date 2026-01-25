import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivroFiltrosComponent } from './livro-filtros.component';

describe('LivroFiltrosComponent', () => {
  let component: LivroFiltrosComponent;
  let fixture: ComponentFixture<LivroFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroFiltrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivroFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
