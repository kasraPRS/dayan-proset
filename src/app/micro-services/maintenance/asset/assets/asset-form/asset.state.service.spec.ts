import { TestBed } from "@angular/core/testing";

import { AssetStateService } from "./asset.state.service";

describe("AssetStateService", () => {
  let service: AssetStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetStateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
