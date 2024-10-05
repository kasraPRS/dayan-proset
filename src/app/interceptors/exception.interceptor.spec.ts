import { TestBed } from "@angular/core/testing";
import { HttpInterceptorFn } from "@angular/common/http";

import { exceptionInterceptor } from "./exception.interceptor";

describe("exceptionInterceptor", () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => exceptionInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(interceptor).toBeTruthy();
  });
});
