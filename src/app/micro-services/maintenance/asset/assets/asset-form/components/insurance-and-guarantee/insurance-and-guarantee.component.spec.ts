import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetInsuranceAndGuaranteeComponent } from "./insurance-and-guarantee.component";

describe("AssetInsuranceAndGuaranteeComponent", () => {
  let component: AssetInsuranceAndGuaranteeComponent;
  let fixture: ComponentFixture<AssetInsuranceAndGuaranteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetInsuranceAndGuaranteeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetInsuranceAndGuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
