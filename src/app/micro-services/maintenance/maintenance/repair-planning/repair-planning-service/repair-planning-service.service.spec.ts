import { TestBed } from "@angular/core/testing";

import { RepairPlanningServiceService } from "./repair-planning-service.service";

describe("RepairPlanningServiceService", () => {
  let service: RepairPlanningServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepairPlanningServiceService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
