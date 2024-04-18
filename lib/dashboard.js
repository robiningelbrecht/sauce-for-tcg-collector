const renderDashboard = async () => {
    const region = window.location.pathname.split('/').at(-1);
    const parsedRows = (await parseSheet()).filter(row => row[3] === region);
    const cardIds = parsedRows.map(row => parseInt(row[0]));
    const uri = `https://www.tcgcollector.com/cards/${region}?releaseDateOrder=newToOld&cardsPerPage=120&displayAs=images&sortBy=cardNameAsc&cards=${cardIds.join(',')}`;

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
};

renderDashboard();