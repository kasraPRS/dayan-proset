import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProsetDatepickerComponent } from "./proset-datepicker.component";

describe("ProsetDatepickerComponent", () => {
  let component: ProsetDatepickerComponent;
  let fixture: ComponentFixture<ProsetDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProsetDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProsetDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
