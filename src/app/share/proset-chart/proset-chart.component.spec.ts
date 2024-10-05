import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProsetChartComponent } from "./proset-chart.component";

describe("ProsetChartComponent", () => {
  let component: ProsetChartComponent;
  let fixture: ComponentFixture<ProsetChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProsetChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProsetChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
