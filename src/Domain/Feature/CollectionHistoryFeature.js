import {GoogleSheet} from "../GoogleSheet";

export class CollectionHistoryFeature {
    constructor(settings, currentRegion) {
        this.settings = settings;
        this.currentRegion = currentRegion;
    }

    getFeatureDescription = () => {
        return 'Collection history';
    };

    getReasonsForFailure = async () => {
        const failureReasons = [];
        if (document.querySelectorAll('div#tcg-region-button-group-container').length === 0) {
            failureReasons.push('Proper html element to attach collection history to not found');
        }

        return failureReasons;
    }

    apply = async () => {
        const $appendTo = document.querySelector('main#page-content');
        const $modalLink = document.createElement('a');
        $modalLink.setAttribute('href', '#modal');
        $modalLink.classList.add(...['button', 'button', 'button-primary']);
        $modalLink.style.minWidth = 'auto';
        $modalLink.style.marginLeft = '3px';
        $modalLink.innerHTML = `<span class="fa-solid fa-chart-line"></span>`;

        document.querySelector('div#tcg-region-button-group-container').appendChild($modalLink);

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

        const googleSheetCollectionHistory = new GoogleSheet(
            this.settings.googleSpreadSheetId,
            'Collection history',
        );

        const myChart = echarts.init($modal.querySelector(".modal-content .chart"));
        const history = this.currentRegion.filterRows(await googleSheetCollectionHistory.parse(), true);

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
                valueFormatter: (value) => value,
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
                }
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
            graphic: [
                {
                    type: 'group',
                    left: '15%',
                    top: 70,
                    children: [
                        {
                            type: 'rect',
                            z: 100,
                            left: 'center',
                            top: 'middle',
                            shape: {
                                width: 180,
                                height: 90
                            },
                            style: {
                                fill: 'transparent',
                                stroke: '#d8d4cf',
                                lineWidth: 1,
                                shadowBlur: 8,
                                shadowOffsetX: 3,
                                shadowOffsetY: 3,
                                shadowColor: 'rgba(0,0,0,0.2)'
                            }
                        },
                        {
                            type: 'text',
                            z: 100,
                            left: 'center',
                            top: 'middle',
                            style: {
                                width: 170,
                                fill: '#d8d4cf',
                                overflow: 'break',
                                text: `Total value: $${currentCollectionState.totalValue}\nTotal cards: ${currentCollectionState.totalCards}\nUnqiue cards: ${currentCollectionState.uniqueCards}\nUnqiue variants: ${currentCollectionState.uniqueVariants}`,
                                font: '14px "Titillium Web", sans-serif'
                            }
                        }
                    ]
                }
            ],
            series: [
                {
                    name: 'Unique cards',
                    type: 'line',
                    data: history.map(row => [
                        row.date,
                        row.uniqueCards
                    ])
                },
                {
                    name: 'Unique variants',
                    type: 'line',
                    data: history.map(row => [
                        row.date,
                        row.uniqueVariants
                    ])
                },
                {
                    name: 'Total cards',
                    type: 'line',
                    data: history.map(row => [
                        row.date,
                        row.totalCards
                    ])
                },
                {
                    name: 'Total value',
                    type: 'line',
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