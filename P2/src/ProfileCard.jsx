import { useRef } from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  const cardRef = useRef(null);

  const updateTilt = event => {
    const card = cardRef.current;
    if (!card || event.pointerType === 'touch') return;

    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty('--pointer-x', `${x * 100}%`);
    card.style.setProperty('--pointer-y', `${y * 100}%`);
    card.style.setProperty('--tilt-x', `${(0.5 - y) * 12}deg`);
    card.style.setProperty('--tilt-y', `${(x - 0.5) * 14}deg`);
    card.classList.add('is-active');
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--pointer-x', '50%');
    card.style.setProperty('--pointer-y', '50%');
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.classList.remove('is-active');
  };

  return (
    <article
      ref={cardRef}
      className="personal-profile-card"
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
      aria-label="Profile card for Wintonia Magpali"
    >
      <div className="personal-profile-card__portrait">
        <img src={new URL('../personal-profile-card.png', import.meta.url).href} alt="Wintonia Magpali in a black suit taking a mirror selfie" />
        <div className="personal-profile-card__shine" aria-hidden="true" />
        <div className="personal-profile-card__identity">
          <span className="personal-profile-card__eyebrow">PERSONAL PROFILE</span>
          <h2>Wintonia Magpali</h2>
          <p>Bachelor of Science in Information Technology</p>
        </div>
      </div>
      <footer className="personal-profile-card__footer">
        <span className="personal-profile-card__avatar" aria-hidden="true">W</span>
        <span>
          <strong>Wintonia Nazarene M. Magpali</strong>
          <small>University of the Cordilleras</small>
        </span>
        <svg className="personal-profile-card__mark" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5 14.8 9l6.7 3-6.7 2.8-2.8 6.7L9.2 14.8 2.5 12l6.7-3L12 2.5Z" />
        </svg>
      </footer>
    </article>
  );
};

export default ProfileCard;
