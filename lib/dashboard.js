const renderDashboard = async () => {
    const parsedRows = await parseSheet(0);
    const cardIds = parsedRows.map(row => parseInt(row.cardId));
    const uri = `https://www.tcgcollector.com/cards?releaseDateOrder=newToOld&cardsPerPage=120&displayAs=images&sortBy=cardNameAsc&cards=${cardIds.join(',')}`;

    const $dashboardUrl = document.createElement("a");
    $dashboardUrl.classList.add('list-group-item');
    $dashboardUrl.setAttribute('href', uri);
    $dashboardUrl.innerHTML = `
        <span class="list-group-item-left-item-container">
          <span aria-hidden="true" class="list-group-item-side-item-icon fa-solid fa-database fa-fw"></span>
        </span>
        Slabs &amp; singles
        <span class="list-group-item-right-item-container">
          <span aria-hidden="true" class="list-group-item-side-item-icon fa-solid fa-chevron-right"></span>
        </span>`;

    const $appendTo = document.querySelectorAll('div.dashboard-section div.list-group')[1];
    $appendTo.appendChild($dashboardUrl);

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

    document.body.appendChild($modal);

    const myChart = echarts.init(document.querySelector(".modal-content .chart"));
    const history = await parseSheet(1488806024);
    // Sort history ASC.
    history.sort(function (a, b) {
        const keyA = new Date(a.date);
        const keyB = new Date(b.date);

        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });

    const option = {
        animation: false,
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => value,
            backgroundColor: 'transparent',
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
        series: [
            {
                name: 'Unique cards',
                type: 'line',
                endLabel: {
                    show: true,
                    formatter: '{a}: {@[1]}',
                    offset: [-50, -15]

                },
                data: history.map(row => [
                    row.date,
                    row.uniqueCards
                ])
            },
            {
                name: 'Unique variants',
                type: 'line',
                endLabel: {
                    show: true,
                    formatter: '{a}: {@[1]}',
                    offset: [-50, -15]

                },
                data: history.map(row => [
                    row.date,
                    row.uniqueVariants
                ])
            },
            {
                name: 'Total cards',
                type: 'line',
                endLabel: {
                    show: true,
                    formatter: '{a}: {@[1]}',
                    offset: [-50, -15]

                },
                data: history.map(row => [
                    row.date,
                    row.totalCards
                ])
            },
            {
                name: 'Total value',
                type: 'line',
                endLabel: {
                    show: true,
                    formatter: '{a}: ${@[1]}',
                    offset: [-50, -15]

                },
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

};

renderDashboard();

window.addEventListener('keydown', (e) => {
    if (e.key == "Escape" && window.location.hash === '#modal') {
        window.location.hash = ""
    }
})