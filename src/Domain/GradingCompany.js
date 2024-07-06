export class GradingCompany {
    constructor(name) {
        if (!name) {
            throw new Error(`Grading company name cannot be empty`);
        }
        this.name = name;
    }

    getName = () => {
        return this.name.toLowerCase();
    }

    getLabel = () => {
        return this.name;
    }

    getGetCertUrl = (certNumber) => {
        if (this.getName() === 'psa') {
            return `https://www.psacard.com/cert/${certNumber}`;
        }
        if (this.getName() === 'cgc') {
            return `https://www.cgccards.com/certlookup/${certNumber}`;
        }

        throw new Error(`Unknown grading company ${this.name}`);
    }
}