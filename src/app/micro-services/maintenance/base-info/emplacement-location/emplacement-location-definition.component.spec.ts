import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmplacementLocationDefinitionComponent } from "./emplacement-location-definition.component";

describe("EmplacementLocationDefinitionComponent", () => {
  let component: EmplacementLocationDefinitionComponent;
  let fixture: ComponentFixture<EmplacementLocationDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplacementLocationDefinitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmplacementLocationDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
