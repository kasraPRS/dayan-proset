import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkLogPersonnelComponent } from "./work-log-personnel.component";

describe("WorkLogPersonnelComponent", () => {
  let component: WorkLogPersonnelComponent;
  let fixture: ComponentFixture<WorkLogPersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogPersonnelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkLogPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
