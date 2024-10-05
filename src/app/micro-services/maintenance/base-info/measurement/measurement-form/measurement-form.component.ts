import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  CodeGeneratorApi,
  GeneratorEntityType,
  Measurement,
  MeasurementApi,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { EventService } from "src/app/share/service/event.service";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";

@Component({
  selector: "proset-measurement-form",
  templateUrl: "./measurement-form.component.html",
  styleUrl: "./measurement-form.component.less",
})
export class MeasurementFormComponent implements OnInit, DialogComponentForm {
  formGroup: FormGroup;
  measurementDto: Measurement = {};
  editCode: string;
  permission = UserPermissions;
  tableRow: Measurement[] = [];
  viewMode = false;

  ngOnInit(): void {}

  constructor(
    private formBuilder: FormBuilder,
    private measurementApi: MeasurementApi,
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
      this.measurementDto = {};
    } else if (formVal.id) {
      this.formGroup.patchValue(formVal);
      this.measurementDto = formVal;
      this.getView(formVal.id);
    }
    this.resetForm();
  }

  onSave(onSuccess: () => void) {
    this.loaderService.setLoading(true);
    this.measurementDto = {
      ...this.measurementDto,
      ...this.formGroup.value,
    };

    if (this.measurementDto.id) {
      this.measurementApi
        .updateMeasurementById(this.measurementDto.id, this.measurementDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            onSuccess();
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    } else {
      this.measurementApi
        .createMeasurement(this.measurementDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            onSuccess();
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    }
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  /**
   * Creates the form measurement for the measurement definition.
   *
   * @returns {void}
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group({
      active: [true],
      code: [
        { value: null, disabled: true },
        [Validators.required, Validators.min(1), Validators.minLength(1)],
      ],
      name: [null, [Validators.required, Validators.minLength(1)]],
      description: [null],
    });

    this.formGroup.valueChanges.subscribe((val) => {
      this.measurementDto = {
        ...this.measurementDto,
        ...val,
      };
    });
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this.measurementApi
      .getMeasurementById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.loaderService.setLoading(true);
        // @ts-ignore
        this.measurementDto = value;
        this.formGroup.patchValue(value);
      });
  }

  resetForm(): void {
    this.measurementDto = {};
    this.formGroup.reset({});
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.MEASUREMENT)
      .subscribe((result) => {
        if (result) {
          this.measurementDto.code = result.code;
          this.formGroup.get("code")?.setValue(result.code);
        }
      });
  }
}
