import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import GenreFilter from "./components/GenreFilter";
import { fetchCartoons } from "./services/api";

const PAGE_SIZE = 12

const App = () => {
  const [cartoons, setCartoons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const selectedGenres = searchParams.get("genre")
    ? searchParams.get("genre").split(",")
    : [];
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [localSearch, setLocalSearch] = useState(searchTerm);

  useDebounce(
    () => {
      if (localSearch !== searchTerm) {
        setSearchParams({
          q: localSearch,
          genre: selectedGenres.join(","),
          page: "1",
        });
      }
    },
    500,
    [localSearch]
  );

  const handleSearch = (term) => {
    setLocalSearch(term);
  };

  const handleGenreChange = (genres) => {
    setSearchParams({
      q: localSearch,
      genre: genres.join(","),
      page: "1",
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      q: searchTerm,
      genre: selectedGenres.join(","),
      page: newPage.toString(),
    });
  };

  const loadCartoons = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await fetchCartoons();

      let filtered = data;

      if (searchTerm.trim()) {
        filtered = filtered.filter((c) =>
          c.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedGenres.length > 0) {
        filtered = filtered.filter(
          (c) =>
            Array.isArray(c.genre) &&
            selectedGenres.some((g) =>
              c.genre.map((x) => x.toLowerCase()).includes(g.toLowerCase())
            )
        );
      }

      setCartoons(filtered);
    } catch (err) {
      setErrorMessage("Failed to fetch cartoons. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartoons();
  }, [searchParams]);

  const startIndex = (page - 1) * PAGE_SIZE;
  const paginated = cartoons.slice(startIndex, startIndex + PAGE_SIZE);
  const totalPages = Math.ceil(cartoons.length / PAGE_SIZE);

  return (
    <main className="pattern">
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Cartoons</span> You'll Love
          </h1>

          <Search searchTerm={localSearch} setSearchTerm={handleSearch} />

          <GenreFilter
            selectedGenres={selectedGenres}
            onChange={handleGenreChange}
          />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Cartoons</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <div className="error-message text-red-500">
              <p>{errorMessage}</p>
              <button
                onClick={loadCartoons}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginated.map((cartoon, index) => (
                  <MovieCard key={cartoon.id || index} movie={cartoon} />
                ))}
              </ul>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
