import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetTreeSelectComponent } from "./asset-tree-select.component";

describe("SubsidiaryComponent", () => {
  let component: AssetTreeSelectComponent;
  let fixture: ComponentFixture<AssetTreeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTreeSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetTreeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
