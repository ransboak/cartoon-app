import React, { useEffect, useState } from "react";

const GenreFilter = ({ selectedGenres, onChange }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Hardcoded genres could also be derived from API
    setGenres([
      "Comedy",
      "Action",
      "Adventure",
      "Drama",
      "Short",
      "Family"
    ]);
  }, []);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => toggleGenre(genre)}
          className={`px-3 py-1 rounded border ${
            selectedGenres.includes(genre)
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
