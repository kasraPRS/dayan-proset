import { TestBed } from "@angular/core/testing";

import { ProsetDialogService } from "./proset-dialog.service";

describe("ProsetDialogService", () => {
  let service: ProsetDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProsetDialogService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
