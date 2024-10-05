import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FailureMechanismComponent } from "./failure-mechanism.component";

describe("FailureMechanismComponent", () => {
  let component: FailureMechanismComponent;
  let fixture: ComponentFixture<FailureMechanismComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureMechanismComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureMechanismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
