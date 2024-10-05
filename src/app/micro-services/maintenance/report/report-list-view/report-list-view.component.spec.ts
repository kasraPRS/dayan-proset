import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReportListViewComponent } from "./report-list-view.component";

describe("ReportListViewComponent", () => {
  let component: ReportListViewComponent;
  let fixture: ComponentFixture<ReportListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportListViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
