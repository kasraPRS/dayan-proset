import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkLogPartComponent } from "./work-log-part.component";

describe("WorkLogPartComponent", () => {
  let component: WorkLogPartComponent;
  let fixture: ComponentFixture<WorkLogPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogPartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkLogPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
