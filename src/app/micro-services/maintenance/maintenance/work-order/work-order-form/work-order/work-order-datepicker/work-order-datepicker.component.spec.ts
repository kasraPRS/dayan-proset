import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkOrderDatepickerComponent } from "./work-order-datepicker.component";

describe("WorkOrderDatepickerComponent", () => {
  let component: WorkOrderDatepickerComponent;
  let fixture: ComponentFixture<WorkOrderDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
