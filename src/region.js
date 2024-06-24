export class Region {
    constructor(name) {
        this.name = name;
    }

    filterRows(rows, filterAll = false) {
        if (this.name === 'all' && !filterAll) {
            return rows;
        }

        return rows.filter(row => row.region === this.name);
    }

    static fromCurrentUrl() {
        const href = window.location.href.replace('#', '');
        if (href.split('/').length === 4) {
            return new Region('all');
        }
        return new Region(href.split('/').slice(-1)[0]);
    }
}