import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkLogChecklistComponent } from "./work-log-checklist.component";

describe("WorkLogChecklistComponent", () => {
  let component: WorkLogChecklistComponent;
  let fixture: ComponentFixture<WorkLogChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogChecklistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkLogChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
