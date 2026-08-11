export interface MicroCMSImage {
  url: string;
  height: number;
  width: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  thumbnail?: MicroCMSImage;
  category: Category;
  tags?: string[];
  authorName?: string;
  readingMinutes?: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListParams {
  limit?: number;
  offset?: number;
  categoryId?: string;
  query?: string;
}

export interface ArticleListResult {
  articles: Article[];
  totalCount: number;
  offset: number;
  limit: number;
}
