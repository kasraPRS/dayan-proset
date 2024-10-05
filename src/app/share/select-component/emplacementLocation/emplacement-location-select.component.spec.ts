import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetSelectComponent } from "./emplacement-location-select.component";

describe("SubsidiaryComponent", () => {
  let component: AssetSelectComponent;
  let fixture: ComponentFixture<AssetSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
