import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FailureMethodDetectionComponent } from "./failure-method-detection.component";

describe("FailureMethodDetectionComponent", () => {
  let component: FailureMethodDetectionComponent;
  let fixture: ComponentFixture<FailureMethodDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureMethodDetectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureMethodDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
