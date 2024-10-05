import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserPermissions } from "../../../../../layouts/menu/enums/menu.enum";
import {
  AssetInfo,
  CodeGeneratorApi,
  FailureMechanism,
  FailureMechanismApi,
  GeneratorEntityType,
} from "@proset/maintenance-client";
import { ProsetDialogService } from "../../../../../share/service/proset-dialog.service";
import { LoaderService } from "../../../../../share/service/loader.service";
import { EventService } from "../../../../../share/service/event.service";
import { FORM_MODE, LIST_EVENTS } from "../../../../../share/enums/enums";
import { finalize } from "rxjs";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";
import { log } from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: "proset-failure-mechanism-form",
  templateUrl: "./failure-mechanism-form.component.html",
  styleUrl: "./failure-mechanism-form.component.less",
})
export class FailureMechanismFormComponent implements DialogComponentForm {
  getFormGroup(): FormGroup {
    return this.formGroup;
  }
  formGroup: FormGroup;
  editCode: string;
  permission = UserPermissions;
  tableRow: FailureMechanism[] = [];
  failureMechanismDto: FailureMechanism = {};
  viewMode = false;
  asset: AssetInfo = {};
  disableAsset: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private codeGeneratorService: CodeGeneratorApi,
    private eventService: EventService<LIST_EVENTS>,
    private _failureMechanismApi: FailureMechanismApi,
  ) {
    this.initForm();
  }
  initComponent(data: any): void {
    const { disableAsset, viewType, ...formVal } = data;
    this.viewMode = viewType == FORM_MODE.VIEW;
    this.disableAsset = disableAsset;

    if (viewType == FORM_MODE.CREATE) {
      this.generateCode();
      this.failureMechanismDto = {};
    } else if (formVal.id) {
      this.failureMechanismDto = formVal;
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
      this.failureMechanismDto = {
        ...this.failureMechanismDto,
        ...val,
      };
    });
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.FAILURE_MECHANISM)
      .subscribe((result) => {
        if (result) {
          this.failureMechanismDto.code = result.code;
          this.formGroup.get("code")?.setValue(result.code);
        }
      });
  }

  resetForm(): void {
    this.failureMechanismDto = {};
    this.formGroup.reset({});
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this._failureMechanismApi
      .getFailureMechanismById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.editCode = value.code!;
        this.formGroup.patchValue(value);
        this.failureMechanismDto = value;
        this.assetChange(this.failureMechanismDto?.asset!);
      });
  }

  assetChange(asset: AssetInfo[] | AssetInfo) {
    this.asset = asset as AssetInfo;
    this.formGroup.controls["asset"].patchValue(asset);
  }

  onClose(): void {}
  onSave() {
    this.loaderService.setLoading(true);
    this.failureMechanismDto = {
      ...this.failureMechanismDto,
      ...this.formGroup.value,
    };
    if (this.failureMechanismDto.id) {
      this._failureMechanismApi
        .updateFailureMechanismById(
          this.failureMechanismDto.id,
          this.failureMechanismDto,
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
      this._failureMechanismApi
        .createFailureMechanism(this.failureMechanismDto)
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
