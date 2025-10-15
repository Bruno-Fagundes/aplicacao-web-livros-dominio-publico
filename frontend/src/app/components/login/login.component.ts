import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AuthResponse } from "../../interfaces/auth.interface";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = "";
  tokenExpirado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      nomeUsuarioOuEmail: ["", [Validators.required]],
      senha: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Verificar se veio da expiração do token
    this.route.queryParams.subscribe(params => {
      if (params['expired'] === 'true') {
        this.tokenExpirado = true;
        this.errorMessage = "Sua sessão expirou. Por favor, faça login novamente.";
      }
    });
  }

  onSubmit() {
    this.errorMessage = "";
    this.tokenExpirado = false;

    if (!this.loginForm.valid) {
      this.errorMessage = "Usuário/E-mail ou Senha Inválidos";
      return;
    }

    this.loading = true;
    const loginData = {
      nomeUsuarioOuEmail: this.loginForm.value.nomeUsuarioOuEmail.trim(),
      senha: this.loginForm.value.senha
    };

    this.authService.login(loginData).subscribe({
      next: (response: AuthResponse) => {
        this.loading = false;
        if (response && response.token && response.usuario) {
          console.log('✅ Login bem-sucedido');

          // Redirecionar para a página que o usuário estava tentando acessar
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pagina-inicial';
          this.router.navigate([returnUrl]);
        } else {
          this.errorMessage = "Resposta inválida do servidor";
        }
      },
      error: (err) => {
        console.error('❌ Erro no login:', err);
        this.loading = false;

        if (err.status === 401) {
          this.errorMessage = "Usuário/E-mail ou Senha Inválidos";
        } else if (err.status === 0) {
          this.errorMessage = "Erro de conexão. Verifique se o servidor está rodando.";
        } else {
          this.errorMessage = "Erro ao fazer login. Tente novamente.";
        }
      }
    });
  }
}