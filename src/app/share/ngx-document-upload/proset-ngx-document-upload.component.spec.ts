import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProsetNgxDocumentUploadComponent } from "./proset-ngx-document-upload.component";

describe("NgxDocumentUploadComponent", () => {
  let component: ProsetNgxDocumentUploadComponent;
  let fixture: ComponentFixture<ProsetNgxDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProsetNgxDocumentUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProsetNgxDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
