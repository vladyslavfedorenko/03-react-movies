import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (query: string) => {
    setError(false);
    setMovies([]); // очищення попередніх результатів
    setLoading(true);

    try {
      const data = await fetchMovies(query, 1);

      if (data.results.length === 0) {
        toast("No movies found for your request.");
      }

      setMovies(data.results);
    } catch (e) {
      // ✅ Використовуємо e, щоб ESLint не лаявся
      console.error("Error fetching movies:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.app}>
      {/* Toaster для показу повідомлень */}
      <Toaster position="top-right" />

      {/* Хедер з формою пошуку */}
      <SearchBar onSubmit={handleSearch} />

      {/* Стан завантаження / помилки / результати */}
      {loading && <Loader />}
      {!loading && error && <ErrorMessage />}
      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelected} />
      )}

      {/* Модальне вікно для перегляду деталей */}
      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
