import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TaskDefinitionComponent } from "./activity.component";

describe("TaskDefinitionComponent", () => {
  let component: TaskDefinitionComponent;
  let fixture: ComponentFixture<TaskDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDefinitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
