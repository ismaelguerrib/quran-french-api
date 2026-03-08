export interface Ayah {
  id: number;
  surahNumber: number;
  ayahNumber: number;
}

export interface AyahResponse {
  data: Ayah;
}

export interface AyahListResponse {
  data: Ayah[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}
