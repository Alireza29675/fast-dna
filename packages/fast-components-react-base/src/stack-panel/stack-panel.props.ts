import React from "react";
import {
    ManagedClasses,
    StackPanelClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface StackPanelManagedClasses
    extends ManagedClasses<StackPanelClassNameContract> {}
export interface StackPanelUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export enum stackPanelOrientation {
    horizontal = "horizontal",
    vertical = "vertical",
}

export interface ItemSpanOverride {
    [key: number]: number;
}

export interface StackPanelHandledProps extends StackPanelManagedClasses {
    /**
     * Whether items outside the viewport should be rendered or not
     * default is true
     */
    virtualize?: boolean;

    /**
     *  the indexes of children that should always be rendered
     */
    neverVirtualizeIndexes?: number[];

    /**
     *  The default span of each item (width in horizontal orientation, height in vertical)
     */
    defaultItemSpan?: number;

    /**
     * An object whose entries specifies the height of items that differ from the default height.
     * Format is {itemIndex: heightValue}
     */
    itemSpanOverrides?: ItemSpanOverride;

    /**
     * How many items to preload before and after the range defined by viewportMaxHeight
     */
    preloadBufferLength?: number;

    /**
     * The orientation of the stackpanel
     */
    orientation?: stackPanelOrientation;

    /**
     * The children of the panel
     */
    children?: React.ReactNode;

    /**
     * Callback for when scroll values change
     */
    onScrollChange?: (newScrollValue: number, scrollMaxValue: number) => void;

    /**
     * Callback for when the range of rendered items changes
     */
    onRenderedRangeChange?: (
        renderedRangeStart: number,
        renderedRangeEnd: number
    ) => void;

    /**
     * When the component scrolls focused content into view how many pixels should the next item "peek" into view
     */
    nextItemPeek?: number;

    /**
     * Whether to enable smooth scrolling
     */
    enableSmoothScrolling?: boolean;

    /**
     * The duration the scroll movement should last
     */
    scrollDuration?: number;

    /**
     * The index of the item initially in view
     */
    initiallyVisibleItemIndex?: number;
}

export type StackPanelProps = StackPanelHandledProps & StackPanelUnhandledProps;
