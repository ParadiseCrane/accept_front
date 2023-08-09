export const reorderList = <T = any>(
  list: T[],
  from: number,
  to: number
): T[] => {
  let new_list;
  if (from < to) {
    new_list = list.slice(0, from);
    new_list = new_list.concat(list.slice(from + 1, to + 1));
    new_list.push(list[from]);
    new_list = new_list.concat(list.slice(to + 1, undefined));
  } else {
    new_list = list.slice(0, to);
    new_list.push(list[from]);
    new_list = new_list.concat(list.slice(to, from));
    new_list = new_list.concat(list.slice(from + 1, undefined));
  }
  return new_list;
};
