export interface NewsArticle {
  source: {
    id: string | null;  // <-- WAJIB ada, boleh null
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}


export interface NowPlaying {
  title: string;
  artist: string;
  duration: string;
  isLive: boolean;
}
