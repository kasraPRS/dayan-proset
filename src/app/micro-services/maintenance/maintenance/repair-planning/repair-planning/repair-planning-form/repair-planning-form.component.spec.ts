import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RepairPlanningFormComponent } from "./repair-planning-form.component";

describe("RepairPlanningFormComponent", () => {
  let component: RepairPlanningFormComponent;
  let fixture: ComponentFixture<RepairPlanningFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairPlanningFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepairPlanningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
