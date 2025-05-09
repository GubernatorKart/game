import controls from '../../constants/controls';
import pathKick from '../../../resources/kick.mp3';
import { createHealthIndicators } from './arena';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const audio = new Audio(pathKick);
        const keySet = new Set();
        let abilityAttackFirstFighter = true;
        let abilityCriticalAttackFirstFighter = true;
        let abilityAttackSecondFighter = true;
        let abilityCriticalAttackSecondFighter = true;
        const timeBetweenAttacks = 1000;
        const timeBetweenCriticalAttacks = 10000;
        function keyDownFun(event) {
            if (!event.repeat) {

                /* Не даэмо виконувати комбінацію з критичного удару гравцю №1 
                поки не пройде час timeBetweenAttacks та timeBetweenCriticalAttacks */
                console.log(': ', controls.PlayerOneCriticalHitCombination.includes(event.code),
                !abilityAttackFirstFighter,  !abilityCriticalAttackFirstFighter, ' - ', controls.PlayerOneCriticalHitCombination.includes(event.code) &&
                (!abilityAttackFirstFighter || !abilityCriticalAttackFirstFighter));
                if (
                    controls.PlayerOneCriticalHitCombination.includes(event.code) &&
                    (!abilityAttackFirstFighter || !abilityCriticalAttackFirstFighter)
                ) {
                    return;
                }

                /* Не даэмо виконувати комбінацію з критичного удару гравцю №2 
                поки не пройде час timeBetweenAttacks та timeBetweenCriticalAttacks */
                if (
                    controls.PlayerTwoCriticalHitCombination.includes(event.code) &&
                    (!abilityAttackSecondFighter || !abilityCriticalAttackSecondFighter)
                ) {
                    return;
                }

                // Не даємо атакувати гравцю №1 частіше ніж timeBetweenAttacks
                if (event.code === controls.PlayerOneAttack && abilityAttackFirstFighter) {
                    abilityAttackFirstFighter = false;
                    keySet.add(event.code);
                    setTimeout(() => {
                        abilityAttackFirstFighter = true;
                    }, timeBetweenAttacks);
                } else if (event.code === controls.PlayerOneAttack && !abilityAttackFirstFighter) return;

                // Не даємо атакувати гравцю №2 частіше ніж timeBetweenAttacks
                if (event.code === controls.PlayerTwoAttack && abilityAttackSecondFighter) {
                    abilityAttackSecondFighter = false;
                    keySet.add(event.code);
                    setTimeout(() => {
                        abilityAttackSecondFighter = true;
                    }, timeBetweenAttacks);
                } else if (event.code === controls.PlayerTwoAttack && !abilityAttackSecondFighter) return;

                keySet.add(event.code);

                // Атакує перший гравець
                if (keySet.has(controls.PlayerOneAttack) && !keySet.has(controls.PlayerOneBlock)) {
                    audio.play();
                    getDamage(firstFighter, secondFighter, keySet.has(controls.PlayerTwoBlock));
                }

                // Атакує другий гравець
                if (keySet.has(controls.PlayerTwoAttack) && !keySet.has(controls.PlayerTwoBlock)) {
                    audio.play();
                    getDamage(secondFighter, firstFighter, keySet.has(controls.PlayerOneBlock));
                }

                // Виконання критичної атаки гравцем №1. Виконуєтся коли у наборі є всі три комбінації клавіш.
                if (controls.PlayerOneCriticalHitCombination.every(element => keySet.has(element))) {
                    audio.play();
                    secondFighter.health -= firstFighter.attack * 2;
                    abilityAttackFirstFighter = false;
                    abilityCriticalAttackFirstFighter = false;
                    setTimeout(() => {
                        abilityCriticalAttackFirstFighter = true;
                    }, timeBetweenCriticalAttacks);
                    setTimeout(() => {
                        abilityAttackFirstFighter = true;
                    }, timeBetweenAttacks);
                }

                // Виконання критичної атаки гравцем №2. Виконуєтся коли у наборі є всі три комбінації клавіш.
                if (controls.PlayerTwoCriticalHitCombination.every(element => keySet.has(element))) {
                    audio.play();
                    firstFighter.health -= secondFighter.attack * 2;
                    abilityAttackSecondFighter = false;
                    abilityCriticalAttackSecondFighter = false;
                    setTimeout(() => {
                        abilityCriticalAttackSecondFighter = true;
                    }, timeBetweenCriticalAttacks);
                    setTimeout(() => {
                        abilityAttackSecondFighter = true;
                    }, timeBetweenAttacks);
                }

                // Перевіряємо умови перемоги
                if (firstFighter.health <= 0) {
                    firstFighter.health = 0;
                    document.removeEventListener('keydown', keyDownFun);
                    document.removeEventListener('keyup', keyUpFun);
                    createHealthIndicators(firstFighter, secondFighter);
                    resolve(firstFighter);
                } else if (secondFighter.health <= 0) {
                    secondFighter.health = 0;
                    document.removeEventListener('keydown', keyDownFun);
                    document.removeEventListener('keyup', keyUpFun);
                    createHealthIndicators(firstFighter, secondFighter);
                    resolve(secondFighter);
                } else createHealthIndicators(firstFighter, secondFighter);
            }
        }
        document.addEventListener('keydown', keyDownFun);
        function keyUpFun(event) {
            keySet.delete(event.code);
        }
        document.addEventListener('keyup', keyUpFun);
    });
}

const criticalChance = () => Math.random() * 2;

/* eslint-disable no-param-reassign */
export function getDamage(attacker, defender, block) {
    const hitPower = getHitPower(attacker);
    defender.health = block
        ? defender.health - Math.max(0, hitPower - getBlockPower(defender))
        : defender.health - hitPower;
}

export function getHitPower(fighter) {
    return fighter.attack * criticalChance();
}

export function getBlockPower(fighter) {
    return fighter.defense * criticalChance();
}
