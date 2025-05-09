import showModal from './modal';
import App from '../../app';

export default function showWinnerModal(fighter) {
    // call showModal function
    const bodyElement = Object.assign(document.createElement('img'), { src: fighter.source });
    showModal({ title: `Winner: ${fighter.name}`, bodyElement, onClose: App });
}
