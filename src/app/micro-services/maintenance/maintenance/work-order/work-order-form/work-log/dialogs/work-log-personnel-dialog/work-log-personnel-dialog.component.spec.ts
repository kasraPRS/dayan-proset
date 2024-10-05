import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkLogPersonnelDialogComponent } from "./work-log-personnel-dialog.component";

describe("WorkLogPersonnelDialogComponent", () => {
  let component: WorkLogPersonnelDialogComponent;
  let fixture: ComponentFixture<WorkLogPersonnelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogPersonnelDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkLogPersonnelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
