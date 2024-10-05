import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RepairPlanningComponent } from "./repair-planning.component";

describe("RepairPlanningComponent", () => {
  let component: RepairPlanningComponent;
  let fixture: ComponentFixture<RepairPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairPlanningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepairPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
