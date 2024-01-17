import { createQuery } from "@tanstack/solid-query";
import { Accessor } from "solid-js";
import { omdbSearchImdbRatings } from "../apis/omdbApiClient";

export const useImdbSearch = (
  titleSearch: Accessor<string | undefined>,
  year: Accessor<string | undefined>
) => {
  return createQuery(() => {
    const searchTitle = titleSearch();
    const searchYear = year();
    return {
      queryKey: ["omdb", "title search", searchTitle, searchYear],
      queryFn: async ({ signal }) => {
        if (!searchTitle) throw new Error("missing search title");

        const data = await omdbSearchImdbRatings(
          searchTitle,
          searchYear,
          signal
        );
        if (data.type === "ratingFound" || data.type === "ratingNotFound")
          return data;
        // I wonder if it's possible to change "gcTime(cacheTime)" now that I know Omdb doesn't have the data yet
        if (searchYear)
          // Try to find movie without year, sometimes netflix will have newer dates than actual release date
          return await omdbSearchImdbRatings(searchTitle, undefined, signal);
      },
      enabled: !!searchTitle,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    };
  });
};
