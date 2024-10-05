import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  CodeGeneratorApi,
  FailureDetectionMethod,
  FailureDetectionMethodApi,
  GeneratorEntityType,
} from "@proset/maintenance-client";
import { UserPermissions } from "../../../../../layouts/menu/enums/menu.enum";
import { ProsetDialogService } from "../../../../../share/service/proset-dialog.service";
import { LoaderService } from "../../../../../share/service/loader.service";
import { EventService } from "../../../../../share/service/event.service";
import { FORM_MODE, LIST_EVENTS } from "../../../../../share/enums/enums";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";
import { finalize } from "rxjs";

@Component({
  selector: "proset-failure-method-detection-form",
  templateUrl: "./failure-method-detection-form.component.html",
  styleUrl: "./failure-method-detection-form.component.less",
})
export class FailureMethodDetectionFormComponent
  implements DialogComponentForm
{
  formGroup: FormGroup;
  failureMethodDetectionDto: FailureDetectionMethod = {};
  editCode: string;
  permission = UserPermissions;
  tableRow: FailureDetectionMethod[] = [];
  viewMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private failureDetectionMethodApi: FailureDetectionMethodApi,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private codeGeneratorService: CodeGeneratorApi,
    private eventService: EventService<LIST_EVENTS>,
  ) {
    this.createForm();
  }

  createForm(): void {
    this.formGroup = this.formBuilder.group({
      code: [{ value: null, disabled: true }, Validators.required],
      name: [null, [Validators.required, Validators.minLength(1)]],
      description: [null],
    });

    this.formGroup.valueChanges.subscribe((val) => {
      this.failureMethodDetectionDto = {
        ...this.failureMethodDetectionDto,
        ...val,
      };
    });
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  initComponent(data: any): void {
    const { viewType, ...formVal } = data;
    this.viewMode = viewType == FORM_MODE.VIEW;

    if (viewType == FORM_MODE.CREATE) {
      this.generateCode();
      this.failureMethodDetectionDto = {};
    } else if (formVal.id) {
      this.formGroup.patchValue(formVal);
      this.failureMethodDetectionDto = formVal;
      this.getView(formVal.id);
    }
    this.resetForm();
  }

  onClose(): void {}

  onSave(): void {
    this.loaderService.setLoading(true);
    this.failureMethodDetectionDto = {
      ...this.failureMethodDetectionDto,
      ...this.formGroup.value,
    };

    if (this.failureMethodDetectionDto.id) {
      this.failureDetectionMethodApi
        .updateFailureDetectionMethodById(
          this.failureMethodDetectionDto.id,
          this.failureMethodDetectionDto,
        )
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    } else {
      this.failureDetectionMethodApi
        .createFailureDetectionMethod(this.failureMethodDetectionDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    }
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this.failureDetectionMethodApi
      .getFailureDetectionMethodById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.loaderService.setLoading(true);
        this.failureMethodDetectionDto = value;
        this.formGroup.patchValue(value);
      });
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.FAILURE_DETECTION_METHOD)
      .subscribe((result) => {
        if (result) {
          this.failureMethodDetectionDto.code = result.code;
          this.formGroup.get("code")?.setValue(result.code);
        }
      });
  }
  resetForm(): void {
    this.failureMethodDetectionDto = {};
    this.formGroup.reset({});
  }
}
