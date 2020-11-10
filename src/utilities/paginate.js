import _ from "lodash";

export function paginate(items, pageNumber, pageSize) {
  const firstIndex = (pageNumber - 1) * pageSize;
  return _(items).slice(firstIndex).take(pageSize).value();
}
