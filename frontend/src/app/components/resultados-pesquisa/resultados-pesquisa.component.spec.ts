import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosPesquisaComponent } from './resultados-pesquisa.component';

describe('ResultadosPesquisaComponent', () => {
  let component: ResultadosPesquisaComponent;
  let fixture: ComponentFixture<ResultadosPesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosPesquisaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResultadosPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
