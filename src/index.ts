type Promisable<T> = T | Promise<T>;
type Iterator<T, U> = (item: T) => Promisable<U>;

async function batchPromises<T, U>(
  batchSize: number,
  collection: Promisable<T[]>,
  callback: Iterator<T, U>
): Promise<U[]> {
  const arr = await Promise.resolve(collection);
  return arr
    .map((_, i) => (i % batchSize ? [] : arr.slice(i, i + batchSize)))
    .map(
      (group) => (res: U[]) =>
        Promise.all(group.map(callback)).then((r) => res.concat(r))
    )
    .reduce<Promise<U[]>>(
      (chain, work) => chain.then(work),
      Promise.resolve([])
    );
}

export = batchPromises;
