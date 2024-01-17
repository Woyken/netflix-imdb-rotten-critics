const omdbUrl = new URL("https://www.omdbapi.com/");
omdbUrl.searchParams.set("apikey", "e254bb8d");

type OmdbApiRatingModel = {
  Source: "Internet Movie Database";
  Value: string;
};

type OmdbApiSearchMovieSuccessModel = {
  Type: "movie";
  DVD: string | "N/A";
  BoxOffice: string | "N/A";
  Production: string | "N/A";
  Website: string | "N/A";
};

type OmdbApiSearchSeriesSuccessModel = {
  Type: "series";
  totalSeasons: string;
};

type OmdbApiSearchSuccessModel = {
  Response: "True";
  Title: string;
  Year: string;
  Rated: string | "N/A";
  Released: string;
  Runtime: string | "N/A";
  Genre: string;
  Director: string | "N/A";
  Writer: string | "N/A";
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string | "N/A";
  Poster: string;
  Ratings: OmdbApiRatingModel[];
  Metascore: string | "N/A";
  imdbRating: string | "N/A";
  imdbVotes: string | "N/A";
  imdbID: string;
  Type: string;
} & (OmdbApiSearchMovieSuccessModel | OmdbApiSearchSeriesSuccessModel);

type OmdbApiSearchFailedModel = {
  Response: "False";
  Error: "unknown error" | "Movie not found!";
};

type OmdbApiSearchResponseModel =
  | OmdbApiSearchSuccessModel
  | OmdbApiSearchFailedModel;

type OmdbSearchSuccess = {
  type: "ratingFound";
  imdbRating: string;
};

type OmdbSearchRatingNotFound = {
  type: "ratingNotFound";
};

type OmdbSearchMovieNotFound = {
  type: "movieNotFound";
};

type OmdbSearchUnknownError = {
  type: "unknownError";
  error: string;
};

type OmdbSearchResult =
  | OmdbSearchSuccess
  | OmdbSearchRatingNotFound
  | OmdbSearchMovieNotFound
  | OmdbSearchUnknownError;

export const omdbSearchImdbRatings = async (
  searchTitle: string,
  searchYear?: string,
  type?: "movie" | "series" | "episode",
  signal?: AbortSignal
): Promise<OmdbSearchResult> => {
  const uri = new URL(omdbUrl);
  uri.searchParams.set("t", searchTitle);
  if (searchYear) uri.searchParams.set("y", searchYear);
  if (type) uri.searchParams.set("type", type);

  const response = await fetch(uri, { signal });
  const data: OmdbApiSearchResponseModel = await response.json();

  if (data.Response === "False") {
    if (data.Error === "Movie not found!")
      return {
        type: "movieNotFound",
      };

    return {
      type: "unknownError",
      error: data.Error,
    };
  }
  if (data.imdbRating === "N/A")
    return {
      type: "ratingNotFound",
    };

  return {
    type: "ratingFound",
    imdbRating: data.imdbRating,
  };
};
