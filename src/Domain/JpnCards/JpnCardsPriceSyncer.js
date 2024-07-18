export class JpnCardsPriceSyncer {
    constructor(api, tcgRepository) {
        this.api = api;
        this.tcgRepository = tcgRepository;
    }

    syncAndPersistForExpansion = async (expansionCode) => {
        const sets = (await this.api.getSets()).filter(set => set.set_code.toLowerCase() === expansionCode);
        if (sets.length !== 1) {
            throw new Error(`Set "${expansionCode}" not found`);
        }

        const set = sets.at(0);
        await this.tcgRepository.save({
            expansionCode: set.set_code.toLowerCase(),
            expansionName: set.name,
            updatedOn: new Date()
        });

        const cards = await this.api.getCardsForSet(expansionCode);
        console.log(cards);
    }
}