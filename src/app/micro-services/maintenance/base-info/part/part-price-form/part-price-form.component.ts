import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PartApi, PartPrice } from "@proset/maintenance-client";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE } from "src/app/share/enums/enums";
import { LoaderService } from "src/app/share/service/loader.service";
import { dateRangeValidator } from "src/app/share/validation/dateRange.validator";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";
import { finalize } from "rxjs";

@Component({
  selector: "proset-part-price-form",
  templateUrl: "./part-price-form.component.html",
  styleUrl: "./part-price-form.component.less",
})
export class PartPriceFormComponent implements OnInit, DialogComponentForm {
  formGroup: FormGroup;
  partPriceDto: PartPrice = {};
  editCode: string;
  permission = UserPermissions;
  viewMode = false;

  ngOnInit(): void {}

  constructor(
    private formBuilder: FormBuilder,
    private partApi: PartApi,
    private loaderService: LoaderService,
  ) {
    this.createForm();
  }

  onClose(): void {}

  initComponent(data: any): void {
    const { viewType, ...formVal } = data;
    this.viewMode = viewType == FORM_MODE.VIEW;

    if (!data) {
      this.partPriceDto = {};
      this.resetForm();
    } else {
      this.partPriceDto = formVal;
      this.formGroup.patchValue(formVal);
    }
  }

  onSave(onSuccess: any) {
    this.loaderService.setLoading(true);
    this.partApi
      .createPartPrice(this.partPriceDto)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: () => {
          onSuccess();
        },
      });
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  /**
   * Creates the form partPrice for the partPrice definition.
   *
   * @returns {void}
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group(
      {
        fromDate: [null, Validators.required],
        toDate: [null, Validators.required],
        price: [null, Validators.required],
        id: [null],
      },
      {
        validator: [dateRangeValidator("fromDate", "toDate")],
      },
    );

    this.formGroup.valueChanges.subscribe((val) => {
      this.partPriceDto = {
        ...this.partPriceDto,
        ...val,
      };
    });
  }

  resetForm(): void {
    this.partPriceDto = {};
    this.formGroup.reset({});
  }
}
