import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomDatatablePagerComponent } from "./custom-datatable-pager.component";

describe("CustomDatatablePagerComponent", () => {
  let component: CustomDatatablePagerComponent;
  let fixture: ComponentFixture<CustomDatatablePagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomDatatablePagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomDatatablePagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
