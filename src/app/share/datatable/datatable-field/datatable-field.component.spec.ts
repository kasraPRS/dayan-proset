import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatatableFieldComponent } from "./datatable-field.component";

describe("DatatableFieldComponent", () => {
  let component: DatatableFieldComponent;
  let fixture: ComponentFixture<DatatableFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatatableFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatatableFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
