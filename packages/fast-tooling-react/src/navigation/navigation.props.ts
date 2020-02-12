import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ChildOptionItem } from "../data-utilities";
import { NavigationClassNameContract } from "./navigation.style";
import { MessageSystem } from "../message-system";
import { TreeNavigationConfigDictionary } from "../message-system/navigation.props";

export const navigationDictionaryLink: string = "navigationDictionaryLink";

export enum NavigationDataType {
    object = "object",
    array = "array",
    children = "children",
    component = "component",
    primitiveChild = "primitiveChild",
}

export interface NavigationState {
    // /**
    //  * The navigation data
    //  */
    // navigation: TreeNavigation;

    /**
     * The current active item
     */
    activeItem: {
        /**
         * Dictionary key
         */
        0: string;

        /**
         * Navigation config key
         */
        1: string;
    } | null;

    // /**
    //  * The hovered tree item
    //  */
    // dragHoverDataLocation: null | string;

    // /**
    //  * The hovered location before
    //  */
    // dragHoverBeforeDataLocation: null | string;

    // /**
    //  * The hovered location after
    //  */
    // dragHoverAfterDataLocation: null | string;

    // /**
    //  * The hovered location center
    //  */
    // dragHoverCenterDataLocation: null | string;

    /**
     * Expanded navigation config items
     */
    expandedNavigationConfigItems: { [key: string]: string[] };

    /**
     * The navigation dictionary
     */
    navigationDictionary: TreeNavigationConfigDictionary | null;
}

export interface TreeNavigation {
    /**
     * The navigation item text
     */
    text: string;

    /**
     * The data location of this item
     */
    dataLocation: string;

    /**
     * The data type, this will result in a different
     * icons used
     */
    type: NavigationDataType;

    /**
     * The items belonging to the text as a dropdown
     */
    items?: TreeNavigation[] | void;
}

export interface NavigationHandledProps
    extends ManagedClasses<NavigationClassNameContract> {
    /**
     * The message system
     * used for sending and receiving data to the message system
     */
    messageSystem: MessageSystem;

    /**
     * If navigation items should enable drag to re-order. For this to work,
     * the parent application will need to ensure the Navigation component is
     * wrapped with a react-dnd backend. For more information on react-dnd backends,
     * see http://react-dnd.github.io/react-dnd/docs/overview
     */
    dragAndDropReordering?: boolean;
}

export type NavigationProps = NavigationHandledProps;
