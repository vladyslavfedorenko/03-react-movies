import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./MovieModal.module.css";
import type { Movie } from "../../types/movie";

export interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRootId = "modal-root";

function ensureModalRoot(): HTMLElement {
  let root = document.getElementById(modalRootId);
  if (!root) {
    root = document.createElement("div");
    root.id = modalRootId;
    document.body.appendChild(root);
  }
  return root;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const modalRoot = ensureModalRoot();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const BACKDROP = (p: string) => `https://image.tmdb.org/t/p/original${p}`;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        {movie.backdrop_path ? (
          <img
            src={BACKDROP(movie.backdrop_path)}
            alt={movie.title}
            className={css.image}
          />
        ) : (
          <div className={css.image} aria-label="No backdrop" />
        )}

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || "—"}
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            {movie.vote_average ? `${movie.vote_average}/10` : "—"}
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
