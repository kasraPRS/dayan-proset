import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FailureModeFormComponent } from "./failure-mode-form.component";

describe("FailureModeFormComponent", () => {
  let component: FailureModeFormComponent;
  let fixture: ComponentFixture<FailureModeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureModeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureModeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
