import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetFinancialComponent } from "./financial.component";

describe("AssetFinancialComponent", () => {
  let component: AssetFinancialComponent;
  let fixture: ComponentFixture<AssetFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetFinancialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
