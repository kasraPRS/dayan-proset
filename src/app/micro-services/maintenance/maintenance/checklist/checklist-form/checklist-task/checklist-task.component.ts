import { Component, OnInit } from "@angular/core";
import { ProsetDialogService } from "../../../../../../share/service/proset-dialog.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import {
  Measurement,
  MeasurementApi,
  Task,
  TaskTypeDto,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { LoaderService } from "../../../../../../share/service/loader.service";
import { DialogComponentForm } from "../../../../../../share/model/dialog-component-form";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "proset-checklist-task",
  templateUrl: "./checklist-task.component.html",
  styleUrls: ["./checklist-task.component.less"],
})
export class ChecklistTaskComponent implements OnInit, DialogComponentForm {
  taskFormGroup: FormGroup;
  selectedTaskType: TaskTypeDto;
  taskType: string[];
  measurementList: Measurement[];
  taskDto: Task;
  protected readonly TaskTypeDto = TaskTypeDto;

  checkUniqTasks: any;

  constructor(
    private dialogRef: MatDialogRef<ChecklistTaskComponent>,
    private dialogService: ProsetDialogService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private measurementApi: MeasurementApi,
  ) {
    this.createTaskFormGroup();
  }

  initComponent(data: any): void {
    if (data.checkUniqTasks) {
      this.checkUniqTasks = data.checkUniqTasks;
    }

    this.taskDto = data.task;

    if (this.taskDto) {
      this.selectedTaskType = this.taskDto?.type!;
      this.taskFormGroup.patchValue(this.taskDto);

      if (this.taskDto.id) {
        this.taskFormGroup.get("type")?.disable();
        this.taskFormGroup.get("measurement")?.disable();
      } else {
        this.taskFormGroup.get("type")?.enable();
        this.taskFormGroup.get("measurement")?.enable();
      }
    }
  }

  getFormGroup(): FormGroup<any> {
    return this.taskFormGroup;
  }

  onClose() {
    this.dialogService.dismissAll();
  }

  onSave() {
    this.dialogRef.close(this.taskFormGroup.value);
  }

  ngOnInit(): void {
    this.taskType = Object.keys(TaskTypeDto);
    this.getMeasurement();
  }

  onChangeType(event: TaskTypeDto) {
    this.selectedTaskType = event;
  }

  createTaskFormGroup() {
    this.taskFormGroup = this.formBuilder.group(
      {
        name: [null, Validators.required],
        type: [null, Validators.required],
        active: [true, Validators.required],
        measurement: [],
      },
      {
        validators: [this.uniqValidation()],
      },
    );

    this.taskFormGroup.get("type")?.valueChanges.subscribe((val) => {
      const measurementCtrl = this.taskFormGroup.controls["measurement"];

      if (val == TaskTypeDto.UNIT) {
        measurementCtrl.setValidators([Validators.required]);
      } else {
        measurementCtrl.clearValidators();
      }

      measurementCtrl.updateValueAndValidity();
    });
  }

  uniqValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formValue = control.getRawValue();

      if (
        !(
          this.checkUniqTasks &&
          formValue.name &&
          this.taskDto?.name != formValue.name
        )
      ) {
        return null;
      }

      return this.checkUniqTasks(control.getRawValue())
        ? null
        : { unique: true };
    };
  }

  getMeasurement() {
    this.loaderService.setLoading(true);
    this.measurementApi
      .getAllMeasurement()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        this.measurementList = response;
      });
  }
}
