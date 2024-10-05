import { FormGroup } from "@angular/forms";

export interface DialogComponentForm {
  initComponent(data: any): void;
  onSave(onSuccess: (e?: any) => void): void;
  onClose(): void;
  getFormGroup(): FormGroup;
}

export interface DialogResponse {
  saved: boolean;
  data?: any;
}
