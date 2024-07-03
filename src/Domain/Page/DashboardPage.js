import * as echarts from "echarts";
import {GoogleSheet} from "../GoogleSheet";

export class DashboardPage {
    constructor($element, currentRegion, settings) {
        this.$element = $element;
        this.currentRegion = currentRegion;
        this.settings = settings;
    }

    reorder = () => {
        const [$firstDashboardSectionsRegion, $secondDashboardSectionsRegion] = this.$element.querySelectorAll('div.dashboard-sections-region');
        $firstDashboardSectionsRegion.querySelector('div#dashboard-expansions-completed-section').style.display = 'none';
        $secondDashboardSectionsRegion.style.display = 'none';
        $firstDashboardSectionsRegion.appendChild($secondDashboardSectionsRegion.querySelectorAll('div.dashboard-sections-subregion')[1].querySelector('div.dashboard-section'));
    };

    renderQuickLinks = async () => {
        const $quickAccessContainer = this.$element.querySelectorAll('div.dashboard-section div.list-group')[1];
        $quickAccessContainer.innerHTML = '<div class="loading-state-loading-spinner-underlay" style="display: flex; justify-content: center"><div class="loading-state-loading-spinner loading-spinner"></div></div>';

        const googleSheetSlabsAndSingles = new GoogleSheet(
            this.settings.googleSpreadSheetId,
            'Slabs / Singles'
        );
        const slabsAndSingles = this.currentRegion.filterRows(await googleSheetSlabsAndSingles.parse());
        const singlesCardIds = slabsAndSingles.filter(row => row.type === 'Single').map(row => parseInt(row.cardId));
        const uri = `/cards?releaseDateOrder=newToOld&cardsPerPage=120&displayAs=images&sortBy=cardNameAsc&cards=${singlesCardIds.join(',')}`;

        const googleSheetQuickAccessLinks = new GoogleSheet(
            this.settings.googleSpreadSheetId,
            'Quick access links',
        );
        const quickAccessLinks = (await googleSheetQuickAccessLinks.parse()).filter(row => {
            return row[this.currentRegion.name] === "TRUE";
        });
        quickAccessLinks.push({
            'title': 'Singles',
            'url': uri,
            'icon': 'fa-database'
        });

        $quickAccessContainer.innerHTML = '';
        quickAccessLinks.forEach(link => {
            const $quickAccessLink = document.createElement("a");
            $quickAccessLink.classList.add('list-group-item');
            $quickAccessLink.setAttribute('href', this.currentRegion.buildUri(link.url));
            $quickAccessLink.innerHTML = `
        <span class="list-group-item-left-item-container">
          <span aria-hidden="true" class="list-group-item-side-item-icon fa-solid ${link.icon} fa-fw"></span>
        </span>
        ${link.title}
        <span class="list-group-item-right-item-container">
          <span aria-hidden="true" class="list-group-item-side-item-icon fa-solid fa-chevron-right"></span>
        </span>`;
            $quickAccessContainer.appendChild($quickAccessLink);
        });
    };

    renderCollectionHistory = async () => {
        const $modalLink = document.createElement('a');
        $modalLink.setAttribute('href', '#modal');
        $modalLink.classList.add(...['button', 'button', 'button-primary']);
        $modalLink.style.minWidth = 'auto';
        $modalLink.style.marginLeft = '3px';
        $modalLink.innerHTML = `<span class="fa-solid fa-chart-line"></span>`;

        this.$element.querySelector('div#tcg-region-button-group-container').appendChild($modalLink);

        const $modal = document.createElement('section');
        $modal.classList.add('modal-window');
        $modal.id = 'modal';
        $modal.innerHTML = `<a class="modal-overlay" aria-hidden="true" href="#" tabindex="-1"></a>
                          <div class="modal-content">
                            <a title="Close modal" aria-label="Close modal" href="#" class="modal-close">&times; </a>
                            <h2 id="modal-title">Collection history</h2>
                            <div class="chart"></div>
                          </div>`;

        this.$element.appendChild($modal);

        const googleSheetCollectionHistory = new GoogleSheet(
            this.settings.googleSpreadSheetId,
            'Collection history',
        );
        const myChart = echarts.init(this.$element.querySelector(".modal-content .chart"));
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