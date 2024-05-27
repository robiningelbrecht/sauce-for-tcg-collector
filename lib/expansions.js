const renderExpansions = async () => {
    const parsedRows = await parseSheet(2064500406);

    document.querySelectorAll('div.expansion-logo-grid-item').forEach(element => {
        const expansionCode = element.querySelector('span.expansion-logo-grid-item-expansion-code').textContent.trim();
        const matchedRows = parsedRows.filter(row => row.expansionCode === expansionCode);
        if (matchedRows.length === 1) {
            const $elementToAppendTo = element.querySelector('div.expansion-logo-grid-item-price');
            const $expansionValueContainer = document.createElement("small");
            $expansionValueContainer.innerHTML = '$' + matchedRows[0].totalValue;
            $elementToAppendTo.append($expansionValueContainer);
        }

    });
};

renderExpansions();