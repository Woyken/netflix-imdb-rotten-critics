import { createQuery } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

type OmdbResponse = {
  imdbRating: string;
};

const omdbUrl = new URL("https://www.omdbapi.com/");
omdbUrl.searchParams.set("apikey", "e254bb8d");

export const useOmdbSearch = (
  titleSearch: Accessor<string | undefined>,
  year: Accessor<string | undefined>
) => {
  return createQuery(() => {
    const searchTitle = titleSearch();
    const searchYear = year()
    return {
      queryKey: ["omdb", "title search", searchTitle, searchYear],
      queryFn: async ({ signal }) => {
        const uri = new URL(omdbUrl);
        uri.searchParams.set("t", searchTitle!);
        uri.searchParams.set("y", searchYear!);

        const response = await fetch(uri, { signal });
        const data = (await response.json()) as OmdbResponse;
        return data;
      },
      enabled: !!searchTitle && !!searchYear,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    };
  });
};
