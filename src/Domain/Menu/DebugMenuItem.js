import {logFeatureList} from "../Feature/FeatureList";

export class DebugMenuItem {
    constructor() {

    }

    build = () => {
        const $menuItem = document.createElement("a");
        $menuItem.classList.add('navbar-button');
        $menuItem.setAttribute('href', '#');
        $menuItem.setAttribute('title', 'Debug Sauce for TCG Collector');
        $menuItem.innerHTML = `<span aria-hidden="true" class="fa-solid fa-bug"></span>`;
        $menuItem.addEventListener('click', logFeatureList);

        return $menuItem;
    };
}