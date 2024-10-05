import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Asset } from "@proset/maintenance-client";
import { dateRangeValidator } from "src/app/share/validation/dateRange.validator";
import { AssetStateService } from "../../asset.state.service";

@Component({
  selector: "proset-asset-insurance-and-guarantee",
  templateUrl: "./insurance-and-guarantee.component.html",
  styleUrl: "./insurance-and-guarantee.component.less",
})
export class AssetInsuranceAndGuaranteeComponent implements OnInit {
  form: FormGroup;

  hasOptions = [
    { label: "HAS", value: true },
    { label: "HAS_NOT", value: false },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private assetStateService: AssetStateService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.initDisabledFields();
    this.initValueChanges();

    this.assetStateService.assetDto$.subscribe((assetDto: any) => {
      this.onChangeDto(assetDto);
    });
  }

  onChangeDto(assetDto: Asset): void {
    if (assetDto?.insuranceAndGuarantee) {
      this.form.patchValue(assetDto?.insuranceAndGuarantee, {
        emitEvent: false,
      });
    }
  }

  createForm() {
    this.form = this.formBuilder.group(
      {
        id: [null],
        hasInsurance: [null],
        hasGuarantee: [null],
        insurance: [null],
        insurer: [null],
        insuranceStartDate: [null],
        insuranceEndDate: [null],
        guaranteeStartDate: [null],
        guaranteeEndDate: [null],
        description: [null],
      },
      {
        validator: [
          dateRangeValidator("insuranceStartDate", "insuranceEndDate"),
          dateRangeValidator("guaranteeStartDate", "guaranteeEndDate"),
        ],
      },
    );

    this.assetStateService.registerForm(
      this.form,
      "AssetInsuranceAndGuarantee",
    );
  }

  /**
   * Disables the specified form controls in the asset form.
   *
   * @returns void
   */
  initDisabledFields() {
    [
      "insurer",
      "insuranceStartDate",
      "insuranceEndDate",
      "insurance",
      "guaranteeStartDate",
      "guaranteeEndDate",
    ].forEach((controlName) => {
      const control = this.form.get(controlName);
      control?.disable();
    });
  }

  insuranceFields() {
    const hasInsurance = this.form.get("hasInsurance")?.value;

    ["insurer", "insuranceStartDate", "insuranceEndDate", "insurance"].forEach(
      (controlName) => {
        const control = this.form.get(controlName);
        if (hasInsurance) {
          control?.enable();
          if (controlName != "insurer") {
            control?.setValidators([Validators.required]);
          }
        } else {
          control?.disable();
          control?.reset(null);
          control?.clearValidators();
        }
        control?.updateValueAndValidity();
      },
    );
  }

  guaranteeFields() {
    const hasGuarantee = this.form.get("hasGuarantee")?.value;
    ["guaranteeStartDate", "guaranteeEndDate"].forEach((controlName) => {
      const control = this.form.get(controlName);

      if (hasGuarantee) {
        control?.enable();
        control?.setValidators([Validators.required]);
      } else {
        control?.disable();
        control?.reset(null);
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  /**
   * Initializes the value changes for the asset form.
   * This method also subscribes to the value changes of the asset form and updates the 'assetDto' property with the new form values.
   *
   * @returns void
   */
  private initValueChanges() {
    this.form.get("hasInsurance")?.valueChanges.subscribe(() => {
      this.insuranceFields();
    });

    this.form.controls["hasGuarantee"].valueChanges.subscribe(() => {
      this.guaranteeFields();
    });
  }

  ngOnDestroy(): void {
    this.assetStateService.unregisterForm("AssetInsuranceAndGuarantee");
  }
}
