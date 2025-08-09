import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.cadastroForm = this.fb.group(
      {
        nomeUsuario: ["", [Validators.required, Validators.minLength(3)]],
        email: ["", [Validators.required, Validators.email]],
        senha: ["", [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ["", [Validators.required]],
      },
      { validators: this.senhasIguaisValidator },
    );
  }

  senhasIguaisValidator(form: FormGroup) {
    const senha = form.get("senha");
    const confirmarSenha = form.get("confirmarSenha");

    if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
      confirmarSenha.setErrors({ senhasDiferentes: true });
    } else if (confirmarSenha?.errors?.["senhasDiferentes"]) {
      delete confirmarSenha.errors["senhasDiferentes"];
      if (Object.keys(confirmarSenha.errors).length === 0) {
        confirmarSenha.setErrors(null);
      }
    }
    return null;
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";

      // Envia todos os dados incluindo confirmarSenha
      const userData = this.cadastroForm.value;

      this.authService.cadastrar(userData).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage =
            "Cadastro realizado com sucesso! Redirecionando para login...";
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message ||
            "Erro ao realizar cadastro. Tente novamente.";
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.cadastroForm.controls).forEach((key) => {
      this.cadastroForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.cadastroForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors["required"]) {
        return `${field} é obrigatório`;
      }
      if (control.errors["email"]) {
        return "Email inválido";
      }
      if (control.errors["minlength"]) {
        const requiredLength = control.errors["minlength"].requiredLength;
        return `${field} deve ter pelo menos ${requiredLength} caracteres`;
      }
      if (control.errors["senhasDiferentes"]) {
        return "As senhas não coincidem";
      }
    }
    return "";
  }
}
