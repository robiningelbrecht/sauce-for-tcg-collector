import {GoogleSheet} from "../Infrastructure/Utils/GoogleSheet";
import {TcgRegion} from "../Domain/TcgCollector/TcgRegion";

export class CollectionHistoryFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'collection-history-feature';
    };

    needsMutationObserver = () => {
        return false;
    };

    needsToBeApplied = (appState) => {
        return appState.getRouteName() === 'dashboard_page';
    }

    apply = async () => {
        const currentRegion = TcgRegion.fromCurrentUrl();
        const googleSheetCollectionHistory = new GoogleSheet(
            this.settings.getGoogleSpreadSheetId(),
            'Collection history',
        );
        const history = currentRegion.filterRows(await googleSheetCollectionHistory.parse(), true);
        if (history.length === 0) {
            return;
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && window.location.hash === '#modal') {
                window.location.hash = ""
            }
        });

        const $appendTo = document.querySelector('main#page-content');
        const $modalLink = document.createElement('a');
        $modalLink.setAttribute('href', '#modal');
        $modalLink.classList.add(...['button', 'button-primary', 'chart-modal']);
        $modalLink.innerHTML = `<span class="fa-solid fa-chart-line"></span>`;

        document.querySelector('#tcg-region-links-button-group-container').appendChild($modalLink);

        const $modal = document.createElement('section');
        $modal.classList.add('modal-window');
        $modal.id = 'modal';
        $modal.innerHTML = `<a class="modal-overlay" aria-hidden="true" href="#" tabindex="-1"></a>
                          <div class="modal-content">
                            <a title="Close modal" aria-label="Close modal" href="#" class="modal-close">&times; </a>
                            <h2 id="modal-title">Collection history</h2>
                            <div class="chart"></div>
                          </div>`;

        $appendTo.appendChild($modal);

        const myChart = echarts.init($modal.querySelector(".modal-content .chart"));

        // Sort history ASC.
        history.sort(function (a, b) {
            const keyA = new Date(a.date);
            const keyB = new Date(b.date);

            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

        const currentCollectionState = history[history.length - 1];

        const option = {
            animation: false,
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#181A1B',
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return new Date(params.value).toLocaleDateString();
                        }
                    }
                }
            },
            legend: {
                textStyle: {
                    color: '#d8d4cf'
                },
                formatter: function (name) {
                    switch (name) {
                        case 'Unique cards':
                            return `Unique cards (${currentCollectionState.uniqueCards})`;
                        case 'Unique variants':
                            return `Unique variants (${currentCollectionState.uniqueVariants})`;
                        case 'Total cards':
                            return `Total cards (${currentCollectionState.totalCards})`;
                        case 'Total value':
                            return `Total value ($${currentCollectionState.totalValue})`;
                        default:
                            return name;
                    }
                },
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: {
                        year: '{yyyy}',
                        month: '{MMM}',
                        day: '{d} {MMM}',
                        hour: '',
                        minute: '',
                        second: '',
                        millisecond: '',
                        none: ''
                    },
                    color: '#d8d4cf'
                }
            },
            yAxis: [
                {
                    axisLabel: {
                        formatter: function (value, index) {
                            return value;
                        },
                        color: '#d8d4cf'
                    },
                    splitLine: {
                        show: false
                    }
                },
            ],
            series: [
                {
                    name: `Unique cards`,
                    type: 'line',
                    symbol: 'none',
                    smooth: 0.6,
                    data: history.map(row => [
                        row.date,
                        row.uniqueCards
                    ])
                },
                {
                    name: `Unique variants`,
                    type: 'line',
                    symbol: 'none',
                    smooth: 0.6,
                    data: history.map(row => [
                        row.date,
                        row.uniqueVariants
                    ])
                },
                {
                    name: `Total cards`,
                    type: 'line',
                    symbol: 'none',
                    smooth: 0.6,
                    data: history.map(row => [
                        row.date,
                        row.totalCards
                    ])
                },
                {
                    name: `Total value`,
                    type: 'line',
                    symbol: 'none',
                    smooth: 0.6,
                    tooltip: {
                        valueFormatter: (value) => '$' + value
                    },
                    data: history.map(row => [
                        row.date,
                        row.totalValue
                    ])
                }
            ]
        };
        myChart.setOption(option);
    }
}