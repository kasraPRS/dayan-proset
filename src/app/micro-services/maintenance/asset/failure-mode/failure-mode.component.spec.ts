import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FailureModeComponent } from "./failure-mode.component";

describe("FailureModeComponent", () => {
  let component: FailureModeComponent;
  let fixture: ComponentFixture<FailureModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureModeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FailureModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
