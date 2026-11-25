import { createRoot } from 'react-dom/client';
import FatherFlipCard from './FatherFlipCard.jsx';
import MotherFlipCard from './MotherFlipCard.jsx';
import BrotherFlipCard from './BrotherFlipCard.jsx';
import FriendsCircle from './FriendsCircle.jsx';

const fatherRoot = document.getElementById('father-card-root');
const motherRoot = document.getElementById('mother-card-root');
const brotherRoot = document.getElementById('brother-card-root');
const friendsRoot = document.getElementById('friends-circle-root');

if (fatherRoot) createRoot(fatherRoot).render(<FatherFlipCard />);
if (motherRoot) createRoot(motherRoot).render(<MotherFlipCard />);
if (brotherRoot) createRoot(brotherRoot).render(<BrotherFlipCard />);
if (friendsRoot) createRoot(friendsRoot).render(<FriendsCircle />);
