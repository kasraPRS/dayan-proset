import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MeasurementComponent } from "./measurement.component";

describe("MeasurementComponent", () => {
  let component: MeasurementComponent;
  let fixture: ComponentFixture<MeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
