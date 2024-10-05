import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetTreeDialogComponent } from "./asset-tree-dialog.component";

describe("SubsidiaryComponent", () => {
  let component: AssetTreeDialogComponent;
  let fixture: ComponentFixture<AssetTreeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTreeDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetTreeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
