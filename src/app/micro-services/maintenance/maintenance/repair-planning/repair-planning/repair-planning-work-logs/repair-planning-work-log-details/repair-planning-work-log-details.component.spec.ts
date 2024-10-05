import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RepairPlanningWorkLogDetailsComponent } from "./repair-planning-work-log-details.component";

describe("RepairPlanningWorkLogDetailsComponent", () => {
  let component: RepairPlanningWorkLogDetailsComponent;
  let fixture: ComponentFixture<RepairPlanningWorkLogDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairPlanningWorkLogDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepairPlanningWorkLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
