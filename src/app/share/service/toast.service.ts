import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
} from "@angular/material/snack-bar";
import { ToastType } from "../enums/custom-icons.enum";
import { ToastComponent } from "../toast/toast.component";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(private snack: MatSnackBar) {}

  open(
    msg: string,
    action?: string,
    config?: MatSnackBarConfig,
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snack.open(msg, action, config);
  }

  openSnackBar(
    message: string,
    type: ToastType,
    title?: string,
    duration: number = 3000,
  ): MatSnackBarRef<ToastComponent> {
    return this.snack.openFromComponent(ToastComponent, {
      duration: duration,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: "toast-container",
      data: {
        message: message,
        type: type,
        title: title || this.getDefaultTitle(type),
      },
    });
  }
  public success(
    message: string,
    title?: string,
    duration: number = 5000,
  ): void {
    this.openSnackBar(message, ToastType.SUCCESS, title, duration);
  }

  public error(message: string, title?: string, duration: number = 5000): void {
    this.openSnackBar(message, ToastType.ERROR, title, duration);
  }

  public warning(
    message: string,
    title?: string,
    duration: number = 5000,
  ): void {
    this.openSnackBar(message, ToastType.WARNING, title, duration);
  }

  public message(
    message: string,
    title?: string,
    duration: number = 5000,
  ): void {
    this.openSnackBar(message, ToastType.INFO, title, duration);
  }

  private getDefaultTitle(type: ToastType) {
    return "GENERAL." + String(type) + "_TITLE";
  }
}
