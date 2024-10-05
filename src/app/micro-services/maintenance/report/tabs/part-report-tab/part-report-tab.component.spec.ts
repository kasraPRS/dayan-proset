import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PartReportTabComponent } from "./part-report-tab.component";

describe("PartReportTabComponent", () => {
  let component: PartReportTabComponent;
  let fixture: ComponentFixture<PartReportTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartReportTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartReportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
