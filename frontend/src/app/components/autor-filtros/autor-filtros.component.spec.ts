import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorFiltrosComponent } from './autor-filtros.component';

describe('AutorFiltrosComponent', () => {
  let component: AutorFiltrosComponent;
  let fixture: ComponentFixture<AutorFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorFiltrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutorFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
