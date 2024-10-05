import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FailureMethodDetectionFormComponent } from "./failure-method-detection-form.component";

describe("FailureMethodDetectionFormComponent", () => {
  let component: FailureMethodDetectionFormComponent;
  let fixture: ComponentFixture<FailureMethodDetectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureMethodDetectionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureMethodDetectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
