import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmplacementLocationCreationFormComponent } from "./emplacement-location-creation-form.component";

describe("EmplacementLocationCreationFormComponent", () => {
  let component: EmplacementLocationCreationFormComponent;
  let fixture: ComponentFixture<EmplacementLocationCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplacementLocationCreationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmplacementLocationCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
