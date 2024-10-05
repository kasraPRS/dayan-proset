import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChecklistTaskComponent } from "./checklist-task.component";

describe("ChecklistTaskComponent", () => {
  let component: ChecklistTaskComponent;
  let fixture: ComponentFixture<ChecklistTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistTaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
