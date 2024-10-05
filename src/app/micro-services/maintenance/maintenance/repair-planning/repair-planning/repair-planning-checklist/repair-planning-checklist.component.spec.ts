import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RepairPlanningChecklistComponent } from "./repair-planning-checklist.component";

describe("RepairPlanningChecklistComponent", () => {
  let component: RepairPlanningChecklistComponent;
  let fixture: ComponentFixture<RepairPlanningChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairPlanningChecklistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepairPlanningChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
