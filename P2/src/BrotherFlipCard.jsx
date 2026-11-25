import { useState } from 'react';
import './FatherFlipCard.css';

const brotherPhoto = new URL('../brother-family.jpg', import.meta.url).href;

const BrotherFlipCard = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="father-flip-card-wrap brother-flip-card-wrap">
      <button
        className={`father-flip-card${flipped ? ' is-flipped' : ''}`}
        type="button"
        aria-label={flipped ? 'Show photo of My Brother' : 'Flip to read about My Brother'}
        aria-pressed={flipped}
        onClick={() => setFlipped(current => !current)}
      >
        <span className="father-flip-card__inner">
          <span className="father-flip-card__face father-flip-card__front">
            <img src={brotherPhoto} alt="My Brother" />
            <span className="father-flip-card__scrim" />
            <span className="father-flip-card__front-copy">
              <span className="father-flip-card__eyebrow">BROTHER</span>
              <span className="father-flip-card__name">My Brother</span>
              <span className="father-flip-card__hint">Click or press Enter to flip</span>
            </span>
          </span>
          <span className="father-flip-card__face father-flip-card__back">
            <img src={brotherPhoto} alt="" aria-hidden="true" />
            <span className="father-flip-card__scrim" />
            <span className="father-flip-card__back-copy">
              <span className="father-flip-card__eyebrow">BROTHER</span>
              <span className="father-flip-card__name">My Brother</span>
              <span className="father-flip-card__role">My younger brother</span>
              <span className="father-flip-card__hint">Click or press Enter to flip back</span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
};

export default BrotherFlipCard;
