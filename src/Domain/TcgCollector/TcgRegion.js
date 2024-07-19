export class TcgRegion {
    constructor(name) {
        this.name = name;
    }

    isAll() {
        return this.name === 'all';
    }

    filterRows(rows, filterAll = false) {
        if (this.isAll() && !filterAll) {
            return rows;
        }

        return rows.filter(row => row.region === this.name);
    }

    buildUri(uri) {
        if (this.isAll()) {
            return uri.replace('[REGION]', '');
        }
        return uri.replace('[REGION]', '/' + this.name);
    }

    static fromCurrentUrl() {
        const href = window.location.href.replace('#', '');
        if (href.split('/').length === 4) {
            return new TcgRegion('all');
        }
        return new TcgRegion(href.split('/').slice(-1)[0]);
    }
}