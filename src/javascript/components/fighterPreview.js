import createElement from '../helpers/domHelper';
import {createHealthIndicators} from './arena'

let fightersArr = Array(2);

export function createFighterPreview(fighter, position) { // todo: show fighter info (image, name, health, etc.)
    if (!fightersArr.includes(undefined)) {
        fightersArr.fill(undefined);
    }
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });
    if (fighter)  {
        fighterElement.append(createFighterImage(fighter));
        const arenaFightStatus = document.querySelector('.arena___fight-status');
        if (arenaFightStatus) arenaFightStatus.remove();
        const fightersRoot = document.querySelector('.fighters___root'); 
        fightersArr[position === 'left' ? 0 : 1] = fighter; 
        const fighterInfo = position === 'left' ? createHealthIndicators(...fightersArr, true) : createHealthIndicators(...fightersArr, true);
        fightersRoot.insertBefore(fighterInfo, fightersRoot.firstChild); 
    }

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
