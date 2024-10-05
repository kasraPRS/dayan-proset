import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Asset } from "@proset/maintenance-client";
import { BehaviorSubject } from "rxjs";
import { FORM_MODE } from "src/app/share/enums/enums";

type ChildForms =
  | "AssetTechnical"
  | "AssetMainInfo"
  | "AssetInsuranceAndGuarantee"
  | "AssetFinancial";

@Injectable({
  providedIn: "root",
})
export class AssetStateService {
  private assetDtoSubject = new BehaviorSubject<Asset>({} as Asset);
  private forms: { [key: string]: FormGroup } = {};
  assetDto$ = this.assetDtoSubject.asObservable();
  private viewType: FORM_MODE = FORM_MODE.CREATE;

  constructor() {}

  setAsset(assetDtoPart: Partial<Asset>): void {
    const currentAsset = this.assetDtoSubject.getValue();
    const updatedAsset = { ...currentAsset, ...assetDtoPart };
    this.assetDtoSubject.next(updatedAsset);
  }

  getAsset(): Asset {
    return this.assetDtoSubject.getValue();
  }

  clearAsset(): void {
    this.assetDtoSubject.next({});
  }

  setViewType(viewType: any) {
    this.viewType = viewType;
  }
  getViewType() {
    return this.viewType;
  }
  getViewMode() {
    return this.viewType == FORM_MODE.VIEW;
  }

  registerForm(form: FormGroup, name: ChildForms) {
    this.forms[name] = form;
  }
  unregisterForm(name: ChildForms) {
    delete this.forms[name];
  }
  isValidForms(): boolean {
    return Object.values(this.forms).every((form) => form.valid);
  }

  getForm(name: string): FormGroup {
    return this.forms[name];
  }

  getFormValues(): Asset {
    const mainInfo = this.getForm("AssetMainInfo")?.getRawValue();
    const financial = this.getForm("AssetFinancial")?.getRawValue();
    const technical = this.getForm("AssetTechnical")?.getRawValue();
    const insuranceAndGuarantee = this.getForm(
      "AssetInsuranceAndGuarantee",
    )?.getRawValue();

    let assetDto: Asset = {
      ...mainInfo,
      financial: financial,
      technical: technical,
      insuranceAndGuarantee: insuranceAndGuarantee,
    };

    assetDto.insuranceAndGuarantee =
      assetDto.insuranceAndGuarantee?.hasGuarantee ||
      assetDto.insuranceAndGuarantee?.hasInsurance
        ? assetDto.insuranceAndGuarantee
        : undefined;

    assetDto.technical = !this.areAllPropsEmpty(assetDto.technical)
      ? assetDto.technical
      : undefined;

    assetDto.financial = !this.areAllPropsEmpty(assetDto.financial)
      ? assetDto.financial
      : undefined;

    return assetDto;
  }

  areAllPropsEmpty(obj: any) {
    return Object.values(obj).every((value) => !value);
  }
}
