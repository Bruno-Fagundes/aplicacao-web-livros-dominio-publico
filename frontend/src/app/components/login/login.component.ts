import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService, AuthResponse } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      nomeUsuarioOuEmail: ["", [Validators.required]],
      senha: ["", [Validators.required]],
    });
  }

  // Método para testar conexão com backend
  testarConexao() {
    console.log('🧪 TESTANDO CONEXÃO COM BACKEND...');

    // Teste direto com fetch
    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        nomeUsuarioOuEmail: 'teste',
        senha: 'teste123'
      })
    })
      .then(response => {
        console.log('🔍 Response status:', response.status);
        console.log('🔍 Response headers:', response.headers);
        return response.text(); // Usar text() primeiro
      })
      .then(data => {
        console.log('🔍 Response body (raw):', data);
        try {
          const jsonData = JSON.parse(data);
          console.log('🔍 Response body (JSON):', jsonData);
        } catch (e) {
          console.log('🔍 Response is not JSON:', e);
        }
      })
      .catch(error => {
        console.error('🔍 Fetch error:', error);
      });
  }

  onSubmit() {
    this.errorMessage = "";

    // Chamar teste no primeiro submit
    if (!this.errorMessage) {
      this.testarConexao();
    }

    if (!this.loginForm.valid) {
      this.errorMessage = "Usuário/E-mail ou Senha Inválidos";
      return;
    }

    this.loading = true;

    const loginData = {
      nomeUsuarioOuEmail: this.loginForm.value.nomeUsuarioOuEmail.trim(),
      senha: this.loginForm.value.senha
    };

    console.log('🚀 Dados enviados:', loginData);
    console.log('🌐 URL da API:', 'http://localhost:8080/api/auth/login');
    console.log('🔧 AuthService login method exists:', typeof this.authService.login);

    this.authService.login(loginData).subscribe({
      next: (response: AuthResponse) => {
        console.log('✅ Resposta do backend - TIPO:', typeof response);
        console.log('✅ Resposta do backend - VALOR:', response);
        console.log('✅ response.token existe?', !!response?.token);
        console.log('✅ response.usuario existe?', !!response?.usuario);

        this.loading = false;

        if (response && response.token && response.usuario) {
          console.log('✅ Login bem-sucedido, redirecionando...');
          console.log('✅ Token:', response.token);
          console.log('✅ Usuário:', response.usuario);
          this.router.navigate(['/pagina-inicial']);
        } else {
          console.log('❌ Resposta inválida do backend');
          console.log('❌ Token presente:', !!response?.token);
          console.log('❌ Usuario presente:', !!response?.usuario);
          this.errorMessage = "Usuário/E-mail ou Senha Inválidos";
        }
      },
      error: (err) => {
        console.error('❌ ERRO DETALHADO:');
        console.error('❌ err.status:', err.status);
        console.error('❌ err.statusText:', err.statusText);
        console.error('❌ err.error:', err.error);
        console.error('❌ err.message:', err.message);
        console.error('❌ err.url:', err.url);
        console.error('❌ Erro completo:', err);

        this.loading = false;
        this.errorMessage = "Usuário/E-mail ou Senha Inválidos";
      }
    });
  }
}