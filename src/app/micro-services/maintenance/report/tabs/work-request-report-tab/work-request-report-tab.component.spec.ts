import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkRequestReportTabComponent } from "./work-request-report-tab.component";

describe("WorkRequestReportTabComponent", () => {
  let component: WorkRequestReportTabComponent;
  let fixture: ComponentFixture<WorkRequestReportTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkRequestReportTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkRequestReportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
