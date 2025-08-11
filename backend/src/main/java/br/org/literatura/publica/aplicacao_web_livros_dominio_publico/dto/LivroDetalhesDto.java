package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

public class LivroDetalhesDto {

    private Long livroId;
    private String titulo;
    private String nomeAutor;
    private String genero;
    private String subgenero;
    private String sinopse;
    private int anoPublicacao;
    private float nota;
    private int totalPaginas;
    private String urlCapa;
    private String urlPdf;

    public LivroDetalhesDto() {}

    public LivroDetalhesDto(Long livroId, String titulo, String nomeAutor, String genero,
                            String subgenero, String sinopse, int anoPublicacao, float nota,
                            int totalPaginas, String urlCapa, String urlPdf) {
        this.livroId = livroId;
        this.titulo = titulo;
        this.nomeAutor = nomeAutor;
        this.genero = genero;
        this.subgenero = subgenero;
        this.sinopse = sinopse;
        this.anoPublicacao = anoPublicacao;
        this.nota = nota;
        this.totalPaginas = totalPaginas;
        this.urlCapa = urlCapa;
        this.urlPdf = urlPdf;
    }

    // Getters e Setters
    public Long getLivroId() {
        return livroId;
    }

    public void setLivroId(Long livroId) {
        this.livroId = livroId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getNomeAutor() {
        return nomeAutor;
    }

    public void setNomeAutor(String nomeAutor) {
        this.nomeAutor = nomeAutor;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getSubgenero() {
        return subgenero;
    }

    public void setSubgenero(String subgenero) {
        this.subgenero = subgenero;
    }

    public String getSinopse() {
        return sinopse;
    }

    public void setSinopse(String sinopse) {
        this.sinopse = sinopse;
    }

    public int getAnoPublicacao() {
        return anoPublicacao;
    }

    public void setAnoPublicacao(int anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    public float getNota() {
        return nota;
    }

    public void setNota(float nota) {
        this.nota = nota;
    }

    public int getTotalPaginas() {
        return totalPaginas;
    }

    public void setTotalPaginas(int totalPaginas) {
        this.totalPaginas = totalPaginas;
    }

    public String getUrlCapa() {
        return urlCapa;
    }

    public void setUrlCapa(String urlCapa) {
        this.urlCapa = urlCapa;
    }

    public String getUrlPdf() {
        return urlPdf;
    }

    public void setUrlPdf(String urlPdf) {
        this.urlPdf = urlPdf;
    }
}