import { CommonModule } from "@angular/common";
import { Component, Inject, ViewEncapsulation, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule, MatIcon, TranslateModule],
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class ToastComponent {
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  get toastClass() {
    return String(this.data.type).toLocaleLowerCase();
  }
}
