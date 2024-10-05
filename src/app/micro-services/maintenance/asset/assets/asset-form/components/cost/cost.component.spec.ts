import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetCostListComponent } from "./cost.component";

describe("AssetCostListComponent", () => {
  let component: AssetCostListComponent;
  let fixture: ComponentFixture<AssetCostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetCostListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetCostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
