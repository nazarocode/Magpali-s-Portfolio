import { useState } from 'react';
import './FatherFlipCard.css';
import './FriendsCircle.css';

const baguioFriendsPhoto = new URL('../friends-baguio-1.jpg', import.meta.url).href;
const baguioFriendsPhotoAlt = new URL('../friends-baguio-2.jpg', import.meta.url).href;

const FriendFlipCard = ({ frontPhoto, backPhoto, alt, message, backLabel, frontLabel = 'FRIENDS', backEyebrow = 'FRIENDS', backTitle = 'My circle of friends' }) => {
  const [flipped, setFlipped] = useState(false);

  const updateTilt = event => {
    if (event.pointerType === 'touch') return;

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty('--pointer-x', `${x * 100}%`);
    card.style.setProperty('--pointer-y', `${y * 100}%`);
    card.style.setProperty('--tilt-x', `${(0.5 - y) * 10}deg`);
    card.style.setProperty('--tilt-y', `${(x - 0.5) * 12}deg`);
    card.classList.add('is-active');
  };

  const resetTilt = event => {
    const card = event.currentTarget;
    card.style.setProperty('--pointer-x', '50%');
    card.style.setProperty('--pointer-y', '50%');
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.classList.remove('is-active');
  };

  return (
    <div className="father-card-root">
      <div className="father-flip-card-wrap">
        <button
          className={`father-flip-card friend-memory-card${flipped ? ' is-flipped' : ''}`}
          type="button"
          aria-label={flipped ? 'Show the front photo' : `Flip to read about ${backLabel}`}
          aria-pressed={flipped}
          onClick={() => setFlipped(current => !current)}
          onPointerMove={updateTilt}
          onPointerLeave={resetTilt}
        >
          <span className="father-flip-card__inner">
            <span className="father-flip-card__face father-flip-card__front">
              <img src={frontPhoto} alt={alt} />
              <span className="father-flip-card__scrim" />
              <span className="friend-memory-card__shine" aria-hidden="true" />
              <span className="father-flip-card__front-copy">
                <span className="father-flip-card__eyebrow">{frontLabel}</span>
                <span className="father-flip-card__hint">Click or press Enter to see another memory</span>
              </span>
            </span>
            <span className="father-flip-card__face father-flip-card__back">
              <img src={backPhoto} alt="" aria-hidden="true" />
              <span className="father-flip-card__scrim" />
              <span className="friend-memory-card__shine" aria-hidden="true" />
              <span className="father-flip-card__back-copy">
                <span className="father-flip-card__eyebrow">{backEyebrow}</span>
                <span className="father-flip-card__role">{backTitle}</span>
                <span className="father-flip-card__message">{message}</span>
                <span className="father-flip-card__hint">Click or press Enter to see the photo</span>
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

const FriendsCircle = () => (
  <section className="friends-circle">
    <header className="friends-circle__heading">
      <p className="eyebrow">Friends</p>
  <h2 className="section-title">MY FRIENDS</h2>
      <p className="lead">Good times are even better with the people who make every memory brighter.</p>
    </header>
    <div className="friends-circle__grid">
      <FriendFlipCard
        frontPhoto={baguioFriendsPhoto}
        backPhoto={baguioFriendsPhotoAlt}
        alt="Two friends posing together in Baguio City"
        message="These are some of my friends in Baguio City. I’m thankful for the fun moments and memories we share."
        backLabel="my friends in Baguio City"
        frontLabel="MY CLASSMATES AND ALSO FRIENDS"
        backTitle="My friends in Baguio City"
      />
    </div>
  </section>
);

export default FriendsCircle;