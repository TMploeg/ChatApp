export default interface Page<TData> {
  page: TData[];
  meta: PageMetaData;
}

export interface PageMetaData {
  page: number;
  size: number;
  totalPages: number;
}
