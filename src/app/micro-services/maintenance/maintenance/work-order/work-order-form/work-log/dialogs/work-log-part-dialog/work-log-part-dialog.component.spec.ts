import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkLogPartDialogComponent } from "./work-log-part-dialog.component";

describe("WorkLogPartDialogComponent", () => {
  let component: WorkLogPartDialogComponent;
  let fixture: ComponentFixture<WorkLogPartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogPartDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkLogPartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
