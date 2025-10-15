import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-cadastro",
  templateUrl: "./cadastro.component.html",
  styleUrls: ["./cadastro.component.scss"],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class CadastroComponent {
  cadastroForm: FormGroup;
  loading = false;
  errorMessage = "";
  successMessage = "";

  private fieldLabels: Record<string, string> = {
    nomeUsuario: "Nome de usuário",
    email: "E-mail",
    senha: "Senha",
    confirmarSenha: "Confirmar senha",
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group(
      {
        // removido Validators.minLength(3) do nome de usuário
        nomeUsuario: ["", [Validators.required, Validators.maxLength(30)]],
        email: ["", [Validators.required, Validators.email, Validators.maxLength(100)]],
        // removido Validators.minLength(6) e o pattern da senha
        senha: ["", [Validators.required]],
        confirmarSenha: ["", [Validators.required]],
      },
      { validators: this.senhasIguaisValidator }
    );
  }

  private senhasIguaisValidator(form: AbstractControl): ValidationErrors | null {
    const senha = form.get("senha")?.value;
    const confirmar = form.get("confirmarSenha")?.value;
    return senha !== confirmar ? { senhasDiferentes: true } : null;
  }

  // Mostra mensagens de validação, incluindo erros retornados pelo servidor
  getErrorMessage(field: string): string {
    const control = this.cadastroForm.get(field);
    if (!control) return "";

    // serverError definido via setErrors({ serverError: '...' })
    if (control.errors?.["serverError"]) {
      return control.errors["serverError"];
    }

    if (!control.touched) return "";

    if (control.hasError("required")) {
      return `${this.fieldLabels[field] || field} é obrigatório.`;
    }
    if (control.hasError("email")) {
      return "E-mail inválido.";
    }
    if (control.hasError("minlength")) {
      const req = control.getError("minlength").requiredLength;
      return `${this.fieldLabels[field] || field} deve ter ao menos ${req} caracteres.`;
    }
    if (control.hasError("maxlength")) {
      const req = control.getError("maxlength").requiredLength;
      return `${this.fieldLabels[field] || field} deve ter no máximo ${req} caracteres.`;
    }
    if (control.hasError("pattern")) {
      return "Formato inválido.";
    }

    // erro do grupo (senhas diferentes) — mostra na confirmarSenha
    if (field === "confirmarSenha" && this.cadastroForm.hasError("senhasDiferentes")) {
      return "As senhas não coincidem.";
    }

    return "";
  }

  private markFormGroupTouched() {
    Object.keys(this.cadastroForm.controls).forEach((key) => {
      this.cadastroForm.get(key)?.markAsTouched();
    });
  }

  onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    console.log('onSubmit chamado', { valid: this.cadastroForm.valid });
    // limpa erros server-side anteriores
    this.clearServerErrors();
    this.errorMessage = "";
    this.successMessage = "";

    if (this.cadastroForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;

    // PAGLOAD: servidor espera também confirmarSenha conforme seu backend
    const raw = this.cadastroForm.value;
    const payload = {
      nomeUsuario: (raw.nomeUsuario || "").trim(),
      email: (raw.email || "").trim().toLowerCase(),
      senha: raw.senha,
      confirmarSenha: raw.confirmarSenha,
    };

    // DEBUG (remova logs de senha em produção)
    console.log("🚀 Enviando payload de cadastro:", {
      nomeUsuario: payload.nomeUsuario,
      email: payload.email,
    });

    this.authService.cadastrar(payload).subscribe({
      next: (response) => {
        console.log("✅ Cadastro sucesso:", response);
        this.loading = false;
        this.successMessage = "Cadastro realizado com sucesso! Redirecionando para login...";
        this.cadastroForm.reset();
        setTimeout(() => this.router.navigate(["/login"]), 1500);
      },
      error: (err) => {
        console.error("❌ Erro no cadastro:", err);
        this.loading = false;

        const status = err?.status;
        const body = err?.error;

        if (body) {
          if (body.field && body.message) {
            this.applyFieldServerError(body.field, body.message);
            return;
          }
          if (Array.isArray(body.errors)) {
            body.errors.forEach((e: any) => {
              if (e.field && e.message) {
                this.applyFieldServerError(e.field, e.message);
              }
            });
            return;
          }
          if (body.nomeUsuario) {
            this.applyFieldServerError("nomeUsuario", body.nomeUsuario);
            return;
          }
          if (body.email) {
            this.applyFieldServerError("email", body.email);
            return;
          }
          if (typeof body === "object" && body.message) {
            this.mapMessageToFieldOrGlobal(body.message, status);
            return;
          }
          if (typeof body === "string" && body.length > 0) {
            this.mapMessageToFieldOrGlobal(body, status);
            return;
          }
        }

        if (status === 409) {
          this.errorMessage = "Usuário ou e-mail já cadastrado.";
        } else if (status === 403) {
          const text = err?.error || "";
          this.mapMessageToFieldOrGlobal(text || "Operação não permitida", status);
        } else if (status === 0) {
          this.errorMessage = "Não foi possível conectar ao servidor.";
        } else {
          this.errorMessage = "Erro ao realizar cadastro. Tente novamente.";
        }
      },
    });
  }

  // Aplica erro ao campo do formulário (aparece via getErrorMessage)
  private applyFieldServerError(field: string, message: string) {
    const control = this.cadastroForm.get(field);
    if (!control) {
      this.errorMessage = message;
      return;
    }
    control.setErrors({ ...control.errors, serverError: message });
    control.markAsTouched();
  }

  // Tenta associar uma mensagem textual a um campo ou global
  private mapMessageToFieldOrGlobal(message: string, status?: number) {
    const lower = (message || "").toLowerCase();
    if (lower.includes("usuario") || lower.includes("usuário") || lower.includes("nomeusuario") || lower.includes("nome de usuário")) {
      this.applyFieldServerError("nomeUsuario", message);
      return;
    }
    if (lower.includes("email") || lower.includes("e-mail")) {
      this.applyFieldServerError("email", message);
      return;
    }
    this.errorMessage = message;
  }

  // remove erros server-side anteriores
  private clearServerErrors() {
    Object.keys(this.cadastroForm.controls).forEach((key) => {
      const control = this.cadastroForm.get(key);
      if (control && control.errors && control.errors["serverError"]) {
        const copy = { ...control.errors };
        delete copy["serverError"];
        control.setErrors(Object.keys(copy).length ? copy : null);
      }
    });
    this.errorMessage = "";
  }
}
