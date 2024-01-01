/**
 * Find unique elements in two arrays
 *
 * @param first The first array.
 * @param second The second array.
 * @param hashKey A function to generate hash keys.
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

  // Traversing the 'first' array and adding each element to the hash table
  for (const item of first) hashTable[hashKey(item)] = 1;

  // Traversing the 'second' array and checking if each element exists in the hash table
  // If it exists, set the value of that element in the hash table to 2, indicating that the element exists in both arrays
  // If it doesn't exist, mark the element for removal
  for (const item of second) {
    const key = hashKey(item);
    if (key in hashTable) {
      hashTable[key] = 2;
    } else {
      result.second.push(item);
    }
  }

  // Elements with a value of 1 in the hash table are for saving
  for (const item of first)
    if (hashTable[hashKey(item)] === 1) result.first.push(item);

  return result;
}

export interface UniqueElements<T> {
  first: T[];
  second: T[];
}
