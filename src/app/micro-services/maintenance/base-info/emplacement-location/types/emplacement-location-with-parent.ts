import { EmplacementLocation } from "@proset/maintenance-client";

export interface EmplacementLocationWithParent extends EmplacementLocation {
  parent?: EmplacementLocationWithParent;
}
