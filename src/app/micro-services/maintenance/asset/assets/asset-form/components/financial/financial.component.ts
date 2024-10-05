import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import {
  Asset,
  CostCenter,
  DepreciationCalculation,
  DepreciationMethod,
  Person,
  PurchaseStatus,
  ReportType,
  UserType,
} from "@proset/maintenance-client";
import * as moment from "jalali-moment";
import * as _ from "lodash";
import { ChartsService } from "src/app/share/service/charts.service";
import { AssetCalculateDepreciationService } from "../../asset.calculate-depreciation.service";
import { AssetStateService } from "../../asset.state.service";

@Component({
  selector: "proset-asset-financial",
  templateUrl: "./financial.component.html",
  styleUrl: "./financial.component.less",
})
export class AssetFinancialComponent implements OnInit {
  assetDto: Asset = {};
  userType = UserType;
  ReportType = ReportType;
  form: FormGroup;
  supplier: Person;
  costCenter: CostCenter;
  DepreciationMethod = DepreciationMethod;
  depreciationCalculationList: DepreciationCalculation[] = [];
  changeFired = false;
  chartOption: any;

  constructor(
    private formBuilder: FormBuilder,
    private chartsService: ChartsService,
    private translateService: TranslateService,
    private assetStateService: AssetStateService,
    private assetCalculateDepreciationService: AssetCalculateDepreciationService,
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.initDepreciationValueChanges();
    this.initDepreciationMethod(this.form.value.depreciationMethod);

    this.assetStateService.assetDto$.subscribe((assetDto: Asset) => {
      this.onChangeDto(assetDto);
    });
  }

  createForm() {
    this.form = this.formBuilder.group(
      {
        id: [null],
        price: [null],
        purchaseDate: [null],
        invoiceNumber: [null],
        supplier: [null],
        costCenter: [null],
        depreciationMethod: [null],
        consumableLife: [null, Validators.min(1)],
        depreciationRate: [null, Validators.min(1)],
        depreciationValue: [null],
        accumulatedDepreciation: [{ value: "", disabled: true }],
        bookValue: [{ value: "", disabled: true }],
        depreciationDate: [{ value: "", disabled: true }],
        purchaseStatus: [null],
        replacementValue: [null],
      },
      { validators: this.depreciationLessThanPrice() },
    );

    this.assetStateService.registerForm(this.form, "AssetFinancial");
  }

  initDepreciationMethod(val: any) {
    if (val == DepreciationMethod.DESCENDING) {
      this.form.get("consumableLife")?.disable({ emitEvent: false });
      this.form.get("depreciationRate")?.enable({ emitEvent: false });
    } else if (val == DepreciationMethod.DIRECT) {
      this.form.get("consumableLife")?.enable({ emitEvent: false });
      this.form.get("depreciationRate")?.disable({ emitEvent: false });
    } else {
      this.form.get("consumableLife")?.disable({ emitEvent: false });
      this.form.get("depreciationRate")?.disable({ emitEvent: false });
    }
  }

  initChart() {
    const data = this.depreciationCalculationList;

    if (data?.length) {
      const minyAxisValue = Number(data[data.length - 1].bookValue);
      const maxyAxisValue = Number(data[0].bookValue);
      this.chartOption = this.chartsService.composeMonthlyLineChart(
        data.map((d) => Number(d.depreciationYear)),
        data.map((d) => d.bookValue),
        {
          yAxis: {
            tickPositioner: function () {
              const self: any = this;
              self.tickPositions[0] = minyAxisValue;
              self.tickPositions[self.tickPositions.length - 1] = maxyAxisValue;
              return self.tickPositions;
            },
            labels: {
              formatter: function () {
                const self: any = this;
                const value = self.value / 1000000;
                return Math.round(value).toLocaleString();
              },
            },
            title: {
              text: this.translateService.instant("CURRENCY.MILLION_RIALS"),
            },
          },
          tooltip: {
            format:
              this.translateService.instant("ASSET.FORM.FINANCIAL.BOOK_VALUE") +
              "<b>&nbsp:&nbsp{point.y:,.0f}&nbsp</b><br>",
          },
        },
      );
    }
  }

  onChangeDto(assetDto: Asset) {
    const purchaseDateControl = this.form.get("purchaseDate");

    this.assetDto = assetDto;
    const financial = assetDto?.financial;

    this.depreciationCalculationList =
      this.assetCalculateDepreciationService.init(assetDto);

    if (financial) {
      // set emitEvent false for init set values ignore initDepreciationValueChanges first time
      this.form.patchValue(financial, { emitEvent: false });

      if (financial.supplier) this.onPersonChange(financial.supplier);

      if (financial.costCenter) this.onCostCenterChange(financial.costCenter);

      this.initDepreciationMethod(financial.depreciationMethod);
    }

    purchaseDateControl?.setValidators([
      this.endDateAfterOrEqualValidator(this.utilizationDate),
    ]);
    purchaseDateControl?.updateValueAndValidity({ emitEvent: false });

    if (this.depreciationCalculationList.length) {
      this.setCurrDepreciationStatics();
      this.initChart();
    } else {
      this.form.controls["bookValue"].reset(null);
      this.form.controls["accumulatedDepreciation"].reset(null);
    }
  }

  onPersonChange(supplier: Person) {
    this.form.controls["supplier"].patchValue(supplier);
    this.supplier = supplier;
  }

  onCostCenterChange(costCenter: CostCenter) {
    this.form.controls["costCenter"].patchValue(costCenter);
    this.costCenter = costCenter;
  }

  endDateAfterOrEqualValidator(utilizationDate: any) {
    return (
      fromDateControl: AbstractControl,
    ): { [key: string]: any } | null => {
      const purchaseDate = fromDateControl.value;

      if (purchaseDate && utilizationDate) {
        const startDateMoment = moment(purchaseDate);
        const endDateMoment = moment(utilizationDate);

        if (endDateMoment.isBefore(startDateMoment)) {
          return { purchaseDateBeforeUtilizationDate: true };
        }
      }
      return null;
    };
  }

  depreciationLessThanPrice(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const price = control.get("price");
      const depreciationValue = control.get("depreciationValue");

      if (!price || !depreciationValue) {
        return null;
      }

      if (price.value === null || depreciationValue.value === null) {
        return null;
      }

      return depreciationValue.value <= price.value
        ? null
        : { depreciationExceedsPrice: true };
    };
  }

  initDepreciationValueChanges() {
    this.form.get("depreciationMethod")?.valueChanges.subscribe((val) => {
      this.form.get("consumableLife")?.reset();
      this.form.get("depreciationRate")?.reset();
      this.initDepreciationMethod(val);
      this.reCalculate();
    });
    this.form.get("price")?.valueChanges.subscribe(() => this.reCalculate());
    this.form.get("consumableLife")?.valueChanges.subscribe((val) => {
      this.calcDepricationDate();
      this.reCalculate();
    });
    this.form.get("depreciationRate")?.valueChanges.subscribe((val) => {
      this.reCalculate();
    });

    this.form
      .get("depreciationValue")
      ?.valueChanges.subscribe(() => this.reCalculate());

    if (this.mainForm) {
      this.mainForm.get("utilizationDate")?.valueChanges.subscribe(() => {
        this.form.get("purchaseDate")?.reset(null);
        this.calcDepricationDate();
        this.reCalculate();
      });
    }
  }

  calcDepricationDate() {
    const consumableLife = this.form.get("consumableLife")?.value;

    if (this.mainForm) {
      const utilizationDate = this.mainForm.get("utilizationDate")?.value;

      this.form
        .get("depreciationDate")
        ?.setValue(
          this.assetCalculateDepreciationService.getDepricationDate(
            consumableLife,
            utilizationDate,
          ),
        );
    }
  }

  reCalculate() {
    this.assetDto.utilizationDate = this.utilizationDate;
    this.depreciationCalculationList =
      this.assetCalculateDepreciationService.init(
        {
          ...this.assetDto,
          financial: this.form.getRawValue(),
        },
        true,
      );
    if (this.depreciationCalculationList.length) {
      this.setCurrDepreciationStatics();
      this.initChart();
    } else {
      this.form.controls["bookValue"].reset(null);
      this.form.controls["accumulatedDepreciation"].reset(null);
    }
  }

  setCurrDepreciationStatics() {
    const currDepreciationCalculation = _.find(
      this.depreciationCalculationList,
      (dep: DepreciationCalculation) => {
        return dep.depreciationYear == moment().format("jYYYY");
      },
    );

    if (currDepreciationCalculation) {
      this.form
        .get("accumulatedDepreciation")
        ?.setValue(currDepreciationCalculation.accumulatedDepreciation || 0);
      this.form
        .get("depreciationYear")
        ?.setValue(currDepreciationCalculation.depreciationYear);
      this.form
        .get("bookValue")
        ?.setValue(currDepreciationCalculation.bookValue);
    }
  }

  ngOnDestroy(): void {
    this.assetStateService.unregisterForm("AssetFinancial");
  }

  get depreciationMethod(): string[] {
    return Object.keys(DepreciationMethod);
  }

  get purchaseStatus(): string[] {
    return Object.keys(PurchaseStatus);
  }

  get utilizationDate(): any {
    if (this.mainForm) {
      const utilizationDate = this.mainForm.get("utilizationDate")?.value;
      return utilizationDate ? new Date(utilizationDate) : null;
    }
    return null;
  }

  get mainForm() {
    return this.assetStateService.getForm("AssetMainInfo");
  }
}
