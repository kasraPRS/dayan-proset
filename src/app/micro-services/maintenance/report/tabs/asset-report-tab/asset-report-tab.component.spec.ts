import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetReportTabComponent } from "./asset-report-tab.component";

describe("AssetReportTabComponent", () => {
  let component: AssetReportTabComponent;
  let fixture: ComponentFixture<AssetReportTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetReportTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetReportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
