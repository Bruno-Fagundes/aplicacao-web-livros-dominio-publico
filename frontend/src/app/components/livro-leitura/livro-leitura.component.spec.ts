import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivroLeituraComponent } from './livro-leitura.component';

describe('LivroLeituraComponent', () => {
  let component: LivroLeituraComponent;
  let fixture: ComponentFixture<LivroLeituraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroLeituraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivroLeituraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
