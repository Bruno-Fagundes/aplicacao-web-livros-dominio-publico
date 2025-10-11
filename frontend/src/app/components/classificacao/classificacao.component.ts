import { Component, OnInit, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators'; // use this import
import { ClassificacaoService, EstatisticasLivroDto, ClassificacaoRequestDto } from '../../services/classificacao.service';

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao.component.html',
  styleUrls: ['./classificacao.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ClassificacaoComponent implements OnInit {
  @Input() livroId: number = 0;
  @Input() usuarioId: number = 0;

  public estrelas = [1, 2, 3, 4, 5];

  public estatisticas = signal<EstatisticasLivroDto>({ livroId: 0, totalAvaliacao: 0, qtdeAvaliacao: 0 });
  public minhaNota = signal<number>(0);
  public hoveredNota = signal<number>(0);
  public loading = signal<boolean>(false);
  public mensagemErro = signal<string | null>(null);
  public mensagemSucesso = signal<string | null>(null);

  public notaAtual = computed(() => this.hoveredNota() || this.minhaNota());

  constructor(private classificacaoService: ClassificacaoService) { }

  ngOnInit(): void {
    // Carrega estatísticas sempre
    if (this.livroId) {
      this.carregarEstatisticas();
    }

    // Carrega a nota do usuário somente se estiver logado (usuarioId > 0)
    if (this.livroId && this.usuarioId && this.usuarioId > 0) {
      this.carregarMinhaNota();
    }
  }

  private carregarMinhaNota(): void {
    this.loading.set(true);
    this.classificacaoService.buscarNotaDoUsuario(this.livroId, this.usuarioId)
      .pipe(take(1))
      .subscribe({
        next: (dto: ClassificacaoRequestDto | null) => {
          this.loading.set(false);
          // Se o backend retornar o DTO, pega dto.nota. Caso contrário, 0.
          this.minhaNota.set(dto?.nota ?? 0);
        },
        error: (err: any) => {
          this.loading.set(false);
          this.mensagemErro.set('Erro ao carregar sua nota');
          console.error('buscarNotaUsuario', err);
          // mantenha minhaNota 0
          this.minhaNota.set(0);
        }
      });
  }

  private carregarEstatisticas(): void {
    this.classificacaoService.buscarEstatisticas(this.livroId)
      .pipe(take(1))
      .subscribe({
        next: (d: EstatisticasLivroDto) => this.estatisticas.set(d),
        error: (err: any) => {
          console.error('buscarEstatisticas', err);
        }
      });
  }

  onHover(n: number) { this.hoveredNota.set(n); }
  onLeave() { this.hoveredNota.set(0); }

  public avaliar(nota: number): void {
    console.log('avaliar() chamado com nota=', nota, ' livroId=', this.livroId, ' usuarioId=', this.usuarioId);
    if (!this.usuarioId || this.usuarioId <= 0) {
      this.mensagemErro.set('Faça login para avaliar');
      return;
    }
    if (this.minhaNota() === nota) return; // evita reenvio igual

    this.loading.set(true);
    const body: ClassificacaoRequestDto = { usuarioId: this.usuarioId, nota };
    this.classificacaoService.avaliarLivro(this.livroId, body)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.minhaNota.set(nota);
          this.mensagemSucesso.set('Avaliação salva');
          this.carregarEstatisticas();
          this.loading.set(false);
        },
        error: (err: any) => {
          this.loading.set(false);
          this.mensagemErro.set('Erro ao avaliar');
          console.error('avaliarLivro', err);
        }
      });
  }
}
