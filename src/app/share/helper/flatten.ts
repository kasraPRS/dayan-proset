import * as _ from "lodash";

export function flattenObject(obj: any) {
  const flattened: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key];
    } else if (obj[key] === "") {
      delete obj[key];
    } else if (Array.isArray(obj[key]) && obj[key]?.length == 0) {
      delete obj[key];
    } else {
      flattened[key] = obj[key];
    }
  });
  if (_.isEmpty(flattened)) {
    return null;
  } else {
    return flattened;
  }
}
export function flattenObjectToArray(obj: any) {
  return Object.keys(obj).reduce((accumulator: any[], current) => {
    if (Array.isArray(obj[current])) {
      accumulator = [...obj[current], ...accumulator];
    } else {
      accumulator = [obj[current], ...accumulator];
    }
    return accumulator;
  }, []) as any[];
}

export function flattenArray(nestedArray: any[]): any[] {
  return nestedArray.reduce((acc, current) => {
    acc.push(current);
    if (current.children) {
      acc.push(...flattenArray(current.children));
    }
    return acc;
  }, []);
}
