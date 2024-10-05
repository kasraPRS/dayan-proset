import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkOrderReportTabComponent } from "./work-order-report-tab.component";

describe("WorkOrderReportTabComponent", () => {
  let component: WorkOrderReportTabComponent;
  let fixture: ComponentFixture<WorkOrderReportTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderReportTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderReportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
