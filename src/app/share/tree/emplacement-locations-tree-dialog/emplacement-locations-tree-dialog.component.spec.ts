import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmplacementLocationTreeDialogComponent } from "./emplacement-locations-tree-dialog.component";

describe("SubsidiaryComponent", () => {
  let component: EmplacementLocationTreeDialogComponent;
  let fixture: ComponentFixture<EmplacementLocationTreeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmplacementLocationTreeDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmplacementLocationTreeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
