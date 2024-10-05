import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetDocumentListComponent } from "./document.component";

describe("AssetDocumentListComponent", () => {
  let component: AssetDocumentListComponent;
  let fixture: ComponentFixture<AssetDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetDocumentListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
