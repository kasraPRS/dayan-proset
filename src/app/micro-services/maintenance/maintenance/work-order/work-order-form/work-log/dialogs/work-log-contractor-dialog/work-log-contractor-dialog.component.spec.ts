import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkLogContractorDialogComponent } from "./work-log-contractor-dialog.component";

describe("WorkLogContractorDialogComponent", () => {
  let component: WorkLogContractorDialogComponent;
  let fixture: ComponentFixture<WorkLogContractorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogContractorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkLogContractorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
