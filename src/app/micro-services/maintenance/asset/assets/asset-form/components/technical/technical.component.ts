import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  Asset,
  Fuel,
  Measurement,
  MeasurementApi,
} from "@proset/maintenance-client";
import { AssetStateService } from "../../asset.state.service";

@Component({
  selector: "proset-asset-technical",
  templateUrl: "./technical.component.html",
  styleUrl: "./technical.component.less",
})
export class AssetTechnicalComponent implements OnInit, OnChanges {
  form: FormGroup;

  constructor(
    private measurementApi: MeasurementApi,
    private formBuilder: FormBuilder,
    private assetStateService: AssetStateService,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }

  measurementUnitList: Measurement[];

  ngOnInit() {
    this.createForm();
    this.getMeasurement();

    this.assetStateService.assetDto$.subscribe((assetDto: any) => {
      this.onChangeDto(assetDto);
    });
  }

  onChangeDto(assetDto: Asset): void {
    if (assetDto?.technical) {
      this.form.patchValue(assetDto.technical);
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [null],
      manufacturer: [null],
      model: [null],
      serialNumber: [null],
      weight: [null],
      fuelType: [null],
      width: [null],
      length: [null],
      height: [null],
      voltage: [null],
      power: [null],
      speed: [null],
      maxSpeed: [null],
      speedMeasurement: [null],
    });

    this.assetStateService.registerForm(this.form, "AssetTechnical");
  }

  private getMeasurement(): void {
    this.measurementApi.getAllMeasurement().subscribe((response) => {
      this.measurementUnitList = response;
    });
  }

  ngOnDestroy(): void {
    this.assetStateService.unregisterForm("AssetTechnical");
  }

  get fuelList(): string[] {
    return Object.keys(Fuel);
  }
}
