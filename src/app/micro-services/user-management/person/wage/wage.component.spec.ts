import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WageComponent } from "./wage.component";

describe("WageComponent", () => {
  let component: WageComponent;
  let fixture: ComponentFixture<WageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
