import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkLogContractorComponent } from "./work-log-contractor.component";

describe("WorkLogContractorComponent", () => {
  let component: WorkLogContractorComponent;
  let fixture: ComponentFixture<WorkLogContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogContractorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkLogContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
