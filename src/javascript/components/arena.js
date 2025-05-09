import createElement from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import {fight} from './fight';
import showWinnerModal from './modal/winner'

function createFighter(fighter, position) {
    const imgElement = createFighterImage(fighter);
    const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
    
    const fighterElement = createElement({
        tagName: 'div',
        className: `arena___fighter ${positionClassName}`
    });
    fighterElement.append(imgElement);

    return fighterElement;
}

function createFighters(firstFighter, secondFighter) {
    const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
    const firstFighterElement = createFighter(firstFighter, 'left');
    const secondFighterElement = createFighter(secondFighter, 'right');
    battleField.append(firstFighterElement, secondFighterElement);
    
    return battleField;
}

function createHealthIndicator(fighter, position, choiceFighters) {
    if (fighter) {
        const { name } = fighter;
        const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
        const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
        const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
        const bar = createElement({
            tagName: 'div',
            className: 'arena___health-bar',
            attributes: { id: `${position}-fighter-indicator` }
        });
        bar.append(`Health: ${Math.ceil(fighter.health)}` + (choiceFighters ? ` | Attack: ${fighter.attack} | Defense: ${fighter.defense}` : '')); //Добавляем индикатор здоровья
        fighterName.innerText = name;
        indicator.append(bar);
        container.append(fighterName, indicator);

        return container;
    } else return ''
}

export function createHealthIndicators(leftFighter, rightFighter, choiceFighters = false) {
    // перевіряємо, чи є вже контейнер з індикаторами
    let healthIndicatorsExists = document.querySelector('.arena___fight-status');
    const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
    const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
    const leftFighterIndicator = createHealthIndicator(leftFighter, 'left', choiceFighters);
    const rightFighterIndicator = createHealthIndicator(rightFighter, 'right', choiceFighters);
    
    if (healthIndicatorsExists) {
        healthIndicatorsExists.innerHTML = '';
        healthIndicatorsExists.append(leftFighterIndicator, versusSign, rightFighterIndicator);
        return healthIndicatorsExists
    } else {
        healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
        return healthIndicators
    }
}

function createArena(selectedFighters) {
    const arena = createElement({ tagName: 'div', className: 'arena___root' });
    const healthIndicators = createHealthIndicators(...selectedFighters);
    const fighters = createFighters(...selectedFighters);

    arena.append(healthIndicators, fighters);
    return arena;
}

// todo:
// - start the fight
// - when fight is finished show winner
export default async function renderArena(selectedFighters) {
    const root = document.getElementById('root');
    const arena = createArena(selectedFighters);

    root.innerHTML = '';
    root.append(arena);

    const winner = await fight(...selectedFighters);
    showWinnerModal(winner);
}
