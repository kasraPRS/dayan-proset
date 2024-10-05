import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserPermissions } from "../../../../../layouts/menu/enums/menu.enum";
import {
  AssetInfo,
  CodeGeneratorApi,
  FailureReason,
  FailureReasonApi,
  GeneratorEntityType,
} from "@proset/maintenance-client";
import { ProsetDialogService } from "../../../../../share/service/proset-dialog.service";
import { LoaderService } from "../../../../../share/service/loader.service";
import { EventService } from "../../../../../share/service/event.service";
import { FORM_MODE, LIST_EVENTS } from "../../../../../share/enums/enums";
import { finalize } from "rxjs";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";

@Component({
  selector: "proset-failure-reason-form",
  templateUrl: "./failure-reason-form.component.html",
  styleUrl: "./failure-reason-form.component.less",
})
export class FailureReasonFormComponent implements DialogComponentForm {
  getFormGroup(): FormGroup {
    return this.formGroup;
  }
  formGroup: FormGroup;
  editCode: string;
  permission = UserPermissions;
  tableRow: FailureReason[] = [];
  failureReasonDto: FailureReason = {};
  viewMode = false;
  asset: AssetInfo = {};
  disableAsset: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private codeGeneratorService: CodeGeneratorApi,
    private eventService: EventService<LIST_EVENTS>,
    private _failureReason: FailureReasonApi,
  ) {
    this.initForm();
  }

  initComponent(data: any): void {
    const { disableAsset, viewType, ...formVal } = data;
    this.viewMode = viewType == FORM_MODE.VIEW;
    this.disableAsset = disableAsset;

    if (viewType == FORM_MODE.CREATE) {
      this.generateCode();
      this.failureReasonDto = {};
    } else if (formVal.id) {
      this.failureReasonDto = formVal;
      this.getView(formVal.id);
    }
    this.resetForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      code: [{ value: null, disabled: true }, null, Validators.required],
      asset: [null, Validators.required],
    });

    this.formGroup.valueChanges.subscribe((val) => {
      this.failureReasonDto = {
        ...this.failureReasonDto,
        ...val,
      };
    });
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.FAILURE_REASON)
      .subscribe((result) => {
        if (result) {
          this.failureReasonDto.code = result.code;
          this.formGroup.get("code")?.setValue(result.code);
        }
      });
  }

  resetForm(): void {
    this.failureReasonDto = {};
    this.formGroup.reset({});
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this._failureReason
      .getFailureReasonById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.editCode = value.code!;
        this.formGroup.patchValue(value);
        this.failureReasonDto = value;
        this.assetChange(this.failureReasonDto?.asset!);
      });
  }

  assetChange(asset: AssetInfo[] | AssetInfo) {
    this.asset = asset as AssetInfo;
    this.formGroup.controls["asset"].patchValue(asset);
  }

  onClose(): void {}
  onSave() {
    this.loaderService.setLoading(true);
    this.failureReasonDto = {
      ...this.failureReasonDto,
      ...this.formGroup.value,
    };

    if (this.failureReasonDto.id) {
      this._failureReason
        .updateFailureReasonById(
          this.failureReasonDto.id,
          this.failureReasonDto,
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
      this._failureReason
        .createFailureReason(this.failureReasonDto)
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
}
