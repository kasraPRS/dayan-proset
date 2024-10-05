import { HttpContext } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  Asset,
  AssetStatus,
  CodeGeneratorApi,
  FailureMode,
  FailureModeApi,
  GeneratorEntityType,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { SHOW_TOAST } from "src/app/interceptors/exception.interceptor";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { EventService } from "src/app/share/service/event.service";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";

@Component({
  selector: "proset-failure-mode-form",
  templateUrl: "./failure-mode-form.component.html",
  styleUrl: "./failure-mode-form.component.less",
})
export class FailureModeFormComponent implements OnInit, DialogComponentForm {
  protected AssetStatus = AssetStatus;
  formGroup: FormGroup;
  failureModeDto: FailureMode = {};
  editCode: string;
  permission = UserPermissions;
  tableRow: FailureMode[] = [];
  viewMode = false;
  isInUsed = false;
  asset: Asset;

  ngOnInit(): void {}

  constructor(
    private formBuilder: FormBuilder,
    private failureModeApi: FailureModeApi,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private codeGeneratorService: CodeGeneratorApi,
    private eventService: EventService<LIST_EVENTS>,
  ) {
    this.createForm();
  }

  onClose(): void {}

  initComponent(data: any): void {
    const { viewType, ...formVal } = data;
    this.viewMode = viewType == FORM_MODE.VIEW;
    if (viewType == FORM_MODE.CREATE) {
      this.generateCode();
      this.failureModeDto = {};
    } else if (formVal.id) {
      this.failureModeDto = formVal;
      this.getView(formVal.id);
      this.checkInUsed();
    }
    this.resetForm();
  }

  assetChange(asset: any) {
    this.formGroup.controls["asset"].patchValue(asset);
  }

  onSave() {
    this.loaderService.setLoading(true);
    this.failureModeDto = {
      ...this.failureModeDto,
      ...this.formGroup.value,
    };

    if (this.failureModeDto.id) {
      this.failureModeApi
        .updateFailureModeById(this.failureModeDto.id, this.failureModeDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    } else {
      this.failureModeApi
        .createFailureMode(this.failureModeDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    }
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  /**
   * Creates the form group for the failureMode definition.
   *
   * @returns {void}
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      asset: [null, Validators.required],
      description: [null],
      code: [{ value: null, disabled: true }, Validators.required],
    });

    this.formGroup.valueChanges.subscribe((val) => {
      this.failureModeDto = {
        ...this.failureModeDto,
        ...val,
      };
    });
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this.failureModeApi
      .getFailureModeById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.loaderService.setLoading(true);
        this.editCode = value.code!;
        this.formGroup.patchValue(value);
        this.failureModeDto = value;
      });
  }

  resetForm(): void {
    this.failureModeDto = {};
    this.formGroup.reset({});
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.FAILURE_MODE)
      .subscribe((result) => {
        this.failureModeDto.code = result.code;
        this.formGroup.get("code")?.setValue(result.code);
      });
  }

  checkInUsed() {
    if (this.failureModeDto.id) {
      this.loaderService.setLoading(true);
      this.failureModeApi
        .checkFailureModeIsInUsed(this.failureModeDto.id, "body", false, {
          context: new HttpContext().set(SHOW_TOAST, false),
        })
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          error: (error) => {
            if (error.status && error.status === 406) {
              this.isInUsed = true;
            }
          },
        });
    }
  }
}
