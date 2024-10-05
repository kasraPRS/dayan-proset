import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Entity, StartCode, StartCodeApi } from "@proset/maintenance-client";
import * as _ from "lodash";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { LoaderService } from "src/app/share/service/loader.service";

@Component({
  selector: "proset-start-code-form",
  templateUrl: "./start-code.component.html",
  styleUrl: "./start-code.component.less",
})
export class StartCodeFormComponent implements OnInit {
  form: FormGroup;

  startCodeDto: StartCode[] = [];
  permission = UserPermissions;

  constructor(
    private loaderService: LoaderService,
    private startCodeApi: StartCodeApi,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.createForm();
    this.getStartCodeView();

    this.form.valueChanges.subscribe((value) => {
      this.mappingDto(value);
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      workRequestStartCode: [null],
      WorkOrderStartCode: [null],
      repairPlaningStartCode: [null],
    });
  }

  getStartCodeView() {
    this.loaderService.setLoading(true);
    this.startCodeApi
      .getStartCode()
      .pipe(
        finalize(() => {
          this.loaderService.setLoading(false);
        }),
      )
      .subscribe((res: any) => {
        this.startCodeDto = res;
        this.mappingForm();
      });
  }

  saveStartCode() {
    this.loaderService.setLoading(true);
    if (this.startCodeDto)
      this.startCodeApi
        .updateStartCode(this.startCodeDto)
        .pipe(
          finalize(() => {
            this.loaderService.setLoading(false);
          }),
        )
        .subscribe({
          next: (res) => {
            this.startCodeDto = res;
            this.mappingForm();
          },
        });
    else
      this.startCodeApi
        .createStartCode(this.startCodeDto)
        .pipe(
          finalize(() => {
            this.loaderService.setLoading(false);
          }),
        )
        .subscribe({
          next: (res) => {
            this.startCodeDto = res;
            this.mappingForm();
          },
        });
  }

  mappingDto(formValue: any) {
    let codes: StartCode[] = [];
    if (formValue.workRequestStartCode)
      codes.push({
        startCode: formValue.workRequestStartCode,
        entity: Entity.WORK_REQUEST,
      });

    if (formValue.WorkOrderStartCode)
      codes.push({
        startCode: formValue.WorkOrderStartCode,
        entity: Entity.WORK_ORDER,
      });

    if (formValue.repairPlaningStartCode)
      codes.push({
        startCode: formValue.repairPlaningStartCode,
        entity: Entity.REPAIR_PLANNING,
      });

    this.startCodeDto = codes;
  }

  mappingForm() {
    let value = {};
    _.forEach(this.startCodeDto, (startCode) => {
      if (startCode) {
        if (startCode.entity == Entity.WORK_ORDER)
          value = _.assign(
            {
              WorkOrderStartCode: startCode.startCode,
            },
            value,
          );

        if (startCode.entity == Entity.WORK_REQUEST)
          value = _.assign(
            {
              workRequestStartCode: startCode.startCode,
            },
            value,
          );

        if (startCode.entity == Entity.REPAIR_PLANNING)
          value = _.assign(
            {
              repairPlaningStartCode: startCode.startCode,
            },
            value,
          );
      }
    });

    this.form.patchValue(value);
  }
}
