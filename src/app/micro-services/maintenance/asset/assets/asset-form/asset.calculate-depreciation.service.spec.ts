import { TestBed } from "@angular/core/testing";

import { AssetCalculateDepreciationService } from "./asset.calculate-depreciation.service";

describe("AssetCalculateDepreciationService", () => {
  let service: AssetCalculateDepreciationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetCalculateDepreciationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
