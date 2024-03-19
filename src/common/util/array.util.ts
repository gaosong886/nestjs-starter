/**
 * 找出两个数组的不重复部分
 *
 * @param first 第一个数组
 * @param second 第二个数组
 * @param hashKey 用来进行哈希的 key
 *
 * @example
 * const A = [1, 2, 3, 4, 5];
 * const B = [4, 5, 6, 7, 8];
 * const result = findUniqueElements<number>(A, B, (e) => e + '');
 * console.log(result);
 * // output: { first: [1, 2, 3], second: [6, 7, 8] }
 */

export function findUniqueElements<T>(
  first: T[] = [],
  second: T[] = [],
  hashKey: (e: T) => string,
): UniqueElements<T> {
  const hashTable: { [key: string]: number } = {};
  const result: UniqueElements<T> = { first: [], second: [] };

  // 遍历第一个数组，并将每个元素添加到哈希表中，为其设定值为 1
  for (const item of first) hashTable[hashKey(item)] = 1;

  // 遍历第二个数组，并检查每个元素是否存在于哈希表中
  // 如果存在，将该元素在哈希表中的值设置为 2，表示该元素在两个数组中都存在
  // 如果不存在，则标记该元素以便移除
  for (const item of second) {
    const key = hashKey(item);
    if (key in hashTable) {
      hashTable[key] = 2;
    } else {
      // 哈希表中没有的元素即为仅在第二个数组中有的元素
      result.second.push(item);
    }
  }

  // 哈希表中值为 1 的元素为仅在第一个数组中出现的元素
  for (const item of first)
    if (hashTable[hashKey(item)] === 1) result.first.push(item);

  return result;
}

export interface UniqueElements<T> {
  first: T[];
  second: T[];
}
