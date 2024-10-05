import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkLogActivityComponent } from "./work-log-activity.component";

describe("WorkLogActivityComponent", () => {
  let component: WorkLogActivityComponent;
  let fixture: ComponentFixture<WorkLogActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogActivityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkLogActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
