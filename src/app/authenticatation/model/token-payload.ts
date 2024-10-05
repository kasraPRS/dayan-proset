import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";

export interface TokenPayload {
  resetPassword: boolean;
  name: string;
  permission: UserPermissions[];
  sub: string;
  iat: number;
  exp: number;
}
