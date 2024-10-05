import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FailureReasonComponent } from "./failure-reason.component";

describe("FailureReasonComponent", () => {
  let component: FailureReasonComponent;
  let fixture: ComponentFixture<FailureReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureReasonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
