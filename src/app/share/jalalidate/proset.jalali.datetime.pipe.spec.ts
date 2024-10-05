import { ProsetJalaliDatetimePipe } from "./proset.jalali.datetime.pipe";
import { ShareService } from "../service/share.service";

describe("ProsetJalaliDatetimePipe", () => {
  let service: ShareService;
  it("create an instance", () => {
    const pipe = new ProsetJalaliDatetimePipe(service);
    expect(pipe).toBeTruthy();
  });
});
