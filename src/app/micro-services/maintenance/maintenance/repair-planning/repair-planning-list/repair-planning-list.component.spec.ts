import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RepairPlanningListComponent } from "./repair-planning-list.component";

describe("RepairPlanningListComponent", () => {
  let component: RepairPlanningListComponent;
  let fixture: ComponentFixture<RepairPlanningListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairPlanningListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepairPlanningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
