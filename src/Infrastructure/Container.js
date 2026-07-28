import {PrintBinderPlaceholdersFeature} from "../Feature/PrintBinderPlaceholdersFeature";
import {PrintBinderExpansionLogosFeature} from "../Feature/PrintBinderExpansionLogosFeature";

const features = [
    new PrintBinderPlaceholdersFeature(),
    new PrintBinderExpansionLogosFeature(),
];


const Container = {
    Features: features
}

export default Container;
