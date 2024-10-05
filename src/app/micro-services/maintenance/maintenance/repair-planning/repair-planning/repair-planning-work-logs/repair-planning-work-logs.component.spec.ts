import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RepairPlanningWorkLogsComponent } from "./repair-planning-work-logs.component";

describe("RepairPlanningWorkLogsComponent", () => {
  let component: RepairPlanningWorkLogsComponent;
  let fixture: ComponentFixture<RepairPlanningWorkLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairPlanningWorkLogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepairPlanningWorkLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
