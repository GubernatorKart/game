import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        try {
            const baseFightersInfo = await this.getFighters();
            const baseFighterInfo = baseFightersInfo.find(item => item._id == id); // Повертає объект информации по бійцю
            // Додаємо іншу інформацію, таку як "health" "attack" "defense"
            const allFighterInfo = await callApi(`details/fighter/${baseFighterInfo._id}.json`);
            return allFighterInfo; // повертає обєкт типу {_id: '4', name: 'Zangief', source: 'https...source.gif'}
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
