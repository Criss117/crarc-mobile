export type PaginatedData<T> = {
  data: T[];
  nextPage: number | null;
};

export function paginateData<T>(
  data: T[],
  limit: number,
  page: number,
): PaginatedData<T> {
  const hasMore = data.length > limit;

  return {
    data: data.slice(0, limit),
    nextPage: hasMore ? page + 1 : null,
  };
}
