import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FailureMechanismFormComponent } from "./failure-mechanism-form.component";

describe("FailureMechanismFormComponent", () => {
  let component: FailureMechanismFormComponent;
  let fixture: ComponentFixture<FailureMechanismFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureMechanismFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureMechanismFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
