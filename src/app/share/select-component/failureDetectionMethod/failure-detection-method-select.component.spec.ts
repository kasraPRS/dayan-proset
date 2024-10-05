import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FailureDetectionMethodSelectComponent } from "./failure-detection-method-select.component";

describe("SubsidiaryComponent", () => {
  let component: FailureDetectionMethodSelectComponent;
  let fixture: ComponentFixture<FailureDetectionMethodSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FailureDetectionMethodSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureDetectionMethodSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
