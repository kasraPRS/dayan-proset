import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  CodeGeneratorApi,
  CostCenter,
  CostCenterApi,
  CostCenterType,
  GeneratorEntityType,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { EventService } from "src/app/share/service/event.service";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";
import { id } from "@swimlane/ngx-datatable";
import { result } from "lodash";

@Component({
  selector: "proset-costCenter-form",
  templateUrl: "./cost-center-form.component.html",
  styleUrl: "./cost-center-form.component.less",
})
export class CostCenterFormComponent implements OnInit, DialogComponentForm {
  costCenterTypes = Object.keys(CostCenterType);
  formGroup: FormGroup;
  costCenterDto: CostCenter = {};
  editCode: string;
  permission = UserPermissions;
  tableRow: CostCenter[] = [];
  viewMode = false;

  ngOnInit(): void {}

  constructor(
    private formBuilder: FormBuilder,
    private costCenterApi: CostCenterApi,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private codeGeneratorService: CodeGeneratorApi,
    private eventService: EventService<LIST_EVENTS>,
  ) {
    this.createForm();
  }

  initComponent(data: any): void {
    const { viewType, ...formVal } = data;
    this.viewMode = viewType == FORM_MODE.VIEW;
    if (viewType == FORM_MODE.CREATE) {
      this.generateCode();
      this.costCenterDto = {};
    } else if (formVal.id) {
      this.costCenterDto = formVal;
      this.getView(formVal.id);
    }
    this.resetForm();
  }

  onSave(onSuccess: () => void) {
    this.loaderService.setLoading(true);
    this.costCenterDto = {
      ...this.costCenterDto,
      ...this.formGroup.value,
    };

    if (this.costCenterDto.id) {
      this.costCenterApi
        .updateCostCenterById(this.costCenterDto.id, this.costCenterDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            onSuccess();
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    } else {
      this.costCenterApi
        .createCostCenter(this.costCenterDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            onSuccess();
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
   * Creates the form costCenter for the costCenter definition.
   *
   * @returns {void}
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      type: [null, Validators.required],
      code: [{ value: null, disabled: true }, Validators.required],
    });

    this.formGroup.valueChanges.subscribe((val) => {
      this.costCenterDto = {
        ...this.costCenterDto,
        ...val,
      };
    });
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this.costCenterApi
      .getCostCenterById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.loaderService.setLoading(true);
        this.editCode = value.code!;
        this.formGroup.patchValue(value);
        this.costCenterDto = value;
      });
  }

  resetForm(): void {
    this.costCenterDto = {};
    this.formGroup.reset({});
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.COST_CENTER)
      .subscribe((result) => {
        if (result) {
          this.costCenterDto.code = result.code;
          this.formGroup.get("code")?.setValue(result.code);
        }
      });
  }

  onClose(): void {}
}
