import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import './VideoCard.css';

function LikeButton({ initialLiked = false, onToggle, ariaLabel }) {
  const [liked, setLiked] = useState(!!initialLiked);
  function handleClick(e) {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    if (onToggle) onToggle(next);
  }

  return (
    <button
      type="button"
      className={`vc-like-button ${liked ? 'liked' : ''}`}
      aria-pressed={liked}
      aria-label={ariaLabel || 'Like video'}
      onClick={handleClick}
    >
      <span className="vc-like-icon" aria-hidden="true">
        {liked ? '💖' : '🤍'}
      </span>
    </button>
  );
}

LikeButton.propTypes = {
  initialLiked: PropTypes.bool,
  onToggle: PropTypes.func,
  ariaLabel: PropTypes.string,
};

export function VideoCard({ video }) {
  const { title, description, url, thumbnail, liked } = video;

  return (
    <article className="video-card" role="group" aria-label={`Video: ${title}`}>
      <a
        className="video-card__link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open video ${title}`}
      >
        <div className="video-card__thumb">
          <img
            className="video-card__img"
            src={thumbnail || ''}
            alt={`Thumbnail of ${title}`}
            loading="lazy"
          />

          <span className="video-card__play" role="img" aria-hidden="true">
            ►
          </span>
        </div>

        <div className="video-card__content">
          <h3 className="video-card__title">{title}</h3>
          <p className="video-card__desc">{description}</p>
        </div>
      </a>

      <LikeButton initialLiked={liked} ariaLabel={`Like ${title}`} />
    </article>
  );
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    liked: PropTypes.bool,
  }).isRequired,
};

export default memo(VideoCard);
