import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PartFormComponent } from "./part-form.component";

describe("PartFormComponent", () => {
  let component: PartFormComponent;
  let fixture: ComponentFixture<PartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
