import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmplacementLocationTreeSelectComponent } from "./emplacement-locations-tree-select.component";

describe("SubsidiaryComponent", () => {
  let component: EmplacementLocationTreeSelectComponent;
  let fixture: ComponentFixture<EmplacementLocationTreeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmplacementLocationTreeSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmplacementLocationTreeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
