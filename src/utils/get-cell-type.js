import isDate from "lodash/isDate";
import isFinite from "lodash/isFinite";
import isString from "lodash/isString";

export default function (d) {
  switch (true) {
    case isDate(d):
      return "date";
      break;
    case isFinite(d):
      return "number";
      break;
    case isString(d):
      return "string";
      break;
    default:
      return "";
  }
}
