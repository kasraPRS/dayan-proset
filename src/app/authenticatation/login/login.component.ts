import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { hide } from "@popperjs/core";
import { TokenRequest } from "@proset/maintenance-client";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: "proset-login",
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatIconButton,
    MatLabel,
    ReactiveFormsModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.less",
})
export class LoginComponent implements OnInit {
  protected hide = hide;
  tokenRequest: TokenRequest;
  userForm: FormGroup;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) {}
  onLogin() {
    this.tokenRequest = this.userForm.getRawValue();
    this.authenticationService.login(this.tokenRequest);
  }

  ngOnInit(): void {
    localStorage.removeItem(this.authenticationService.TOKEN);
    this.authenticationService.isLoggedIn();
    this.userForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
}
