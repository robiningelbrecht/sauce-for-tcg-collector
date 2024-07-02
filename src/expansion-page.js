import {ExpansionPage} from "./Domain/Page/ExpansionPage";

const bodyHtml = document.body.innerHTML;
const regex = /window.tcgcollector[\s]*=[\s]*{[\s]*appState:(.*),[\s]*}/mi;
if (!regex.test(bodyHtml)) {
    throw new Error('AppState could not be determined');
}

const appState = JSON.parse(document.body.innerHTML.match(regex)[1]);
const expansionPage = new ExpansionPage(
    document.querySelector('main#page-content'),
    appState
);
document.body.appendChild(expansionPage.buildPrintPlaceholders());
