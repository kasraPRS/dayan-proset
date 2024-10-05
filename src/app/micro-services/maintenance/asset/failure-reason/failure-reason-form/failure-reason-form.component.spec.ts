import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FailureReasonFormComponent } from "./failure-reason-form.component";

describe("FailureReasonFormComponent", () => {
  let component: FailureReasonFormComponent;
  let fixture: ComponentFixture<FailureReasonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureReasonFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureReasonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
