import React from "react";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeEnter,
    keyCodeHome,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import {
    navigationDictionaryLink,
    NavigationHandledProps,
    NavigationProps,
    NavigationState,
} from "./navigation.props";
import { DraggableNavigationTreeItem, NavigationTreeItem } from "./navigation-tree-item";
import { NavigationTreeItemProps } from "./navigation-tree-item.props";
import { Register } from "../message-system/message-system.props";
import { MessageSystemType } from "../message-system";
import { MessageSystemNavigationTypeAction } from "../message-system/message-system.utilities.props";

export default class Navigation extends Foundation<
    NavigationHandledProps,
    {},
    NavigationState
> {
    public static displayName: string = "Navigation";

    protected handledProps: HandledProps<NavigationHandledProps> = {
        messageSystem: void 0,
        dragAndDropReordering: void 0,
        managedClasses: void 0,
    };

    private messageSystemConfig: Register;

    private rootElement: React.RefObject<HTMLDivElement>;

    constructor(props: NavigationProps) {
        super(props);

        this.messageSystemConfig = {
            onMessage: this.handleMessageSystem,
        };

        if (props.messageSystem !== undefined) {
            props.messageSystem.add(this.messageSystemConfig);
        }

        this.state = {
            navigationDictionary: null,
            activeItem: null,
            expandedNavigationConfigItems: {},
            //     dragHoverDataLocation: null,
            //     dragHoverAfterDataLocation: null,
            //     dragHoverBeforeDataLocation: null,
            //     dragHoverCenterDataLocation: null,
        };

        this.rootElement = React.createRef();
    }

    public render(): React.ReactNode {
        return (
            <div
                {...this.unhandledProps()}
                ref={this.rootElement}
                role={"tree"}
                className={this.props.managedClasses.navigation}
            >
                {this.renderDictionaryItem(
                    this.state.navigationDictionary
                        ? this.state.navigationDictionary[1]
                        : null
                )}
            </div>
        );
    }

    /**
     * Handle messages from the message system
     */
    private handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                this.setState({
                    navigationDictionary: e.data.navigationDictionary,
                    activeItem: [
                        e.data.navigationDictionary[1],
                        e.data.navigationDictionary[0][e.data.navigationDictionary[1]][1],
                    ],
                });

                break;
            case MessageSystemType.data:
                break;
            case MessageSystemType.navigation:
                this.setState({
                    activeItem: [
                        e.data.activeDictionaryId,
                        e.data.activeNavigationConfigId,
                    ],
                });
                break;
        }
    };

    private renderDictionaryItem(dictionaryKey: string | null): React.ReactNode {
        if (this.state.navigationDictionary !== null) {
            return this.renderNavigationConfig(
                dictionaryKey,
                this.state.navigationDictionary[0][dictionaryKey][1]
            );
        }

        return null;
    }

    private renderNavigationConfig(
        dictionaryKey: string,
        navigationConfigKey: string
    ): React.ReactNode {
        const hasContent: boolean =
            (Array.isArray(
                this.state.navigationDictionary[0][dictionaryKey][0][navigationConfigKey]
                    .items
            ) &&
                this.state.navigationDictionary[0][dictionaryKey][0][navigationConfigKey]
                    .items.length > 0) ||
            (this.state.navigationDictionary[0][dictionaryKey][0][navigationConfigKey]
                .schema[navigationDictionaryLink] &&
                this.state.navigationDictionary[0][dictionaryKey][0][navigationConfigKey]
                    .data);
        const navigationProps: NavigationTreeItemProps = {
            linkClassName: this.getItemLinkClassName(dictionaryKey, navigationConfigKey),
            contentClassName: this.getItemContentClassName(),
            item: this.state.navigationDictionary[0][dictionaryKey][0][
                navigationConfigKey
            ],

            expanded: this.getExpandedState(dictionaryKey, navigationConfigKey),
            handleClick: this.handleNavigationItemClick(
                dictionaryKey,
                navigationConfigKey
            ),
            handleKeyDown: this.handleTreeItemKeyDown(dictionaryKey, navigationConfigKey),
            dictionaryId: dictionaryKey,
            navigationConfigId: navigationConfigKey,
        };
        const navigationTreeItemChildren: React.ReactNode = [
            this.renderNavigationConfigTrigger(
                dictionaryKey,
                navigationConfigKey,
                hasContent
            ),
            this.renderNavigationConfigContent(
                dictionaryKey,
                navigationConfigKey,
                hasContent
            ),
        ];

        if (
            this.props.dragAndDropReordering &&
            this.state.navigationDictionary[1] !== dictionaryKey && // this is not the root level dictionary item
            this.state.navigationDictionary[0][dictionaryKey][1] === navigationConfigKey // this is a dictionary item
        ) {
            return (
                <DraggableNavigationTreeItem
                    key={dictionaryKey + navigationConfigKey}
                    {...navigationProps}
                >
                    {navigationTreeItemChildren}
                </DraggableNavigationTreeItem>
            );
        }

        return (
            <NavigationTreeItem
                key={dictionaryKey + navigationConfigKey}
                {...navigationProps}
            >
                {navigationTreeItemChildren}
            </NavigationTreeItem>
        );
    }

    private renderNavigationConfigTrigger(
        dictionaryKey: string,
        navigationConfigKey: string,
        hasContent: boolean
    ): React.ReactNode {
        if (
            typeof this.state.navigationDictionary[0][dictionaryKey][0][
                navigationConfigKey
            ].data !== "undefined" &&
            this.state.navigationDictionary[0][dictionaryKey][0][navigationConfigKey]
                .schema[navigationDictionaryLink]
        ) {
            return this.state.navigationDictionary[0][dictionaryKey][0][
                navigationConfigKey
            ].data.map((dictionaryItem: any) => {
                return (
                    <React.Fragment key={dictionaryItem.id}>
                        <span
                            className={this.getItemDisplayTextClassName(
                                dictionaryKey,
                                navigationConfigKey
                            )}
                            onKeyDown={this.handleTreeItemKeyDown(
                                dictionaryKey,
                                navigationConfigKey
                            )}
                            data-dictionaryid={dictionaryKey}
                            data-navigationconfigid={navigationConfigKey}
                            tabIndex={0}
                        >
                            <button
                                className={this.getItemExpandTriggerClassName()}
                                onClick={this.handleToggleNavigationItem(
                                    dictionaryKey,
                                    navigationConfigKey
                                )}
                            />
                            <span
                                onClick={this.handleNavigationItemClick(
                                    dictionaryKey,
                                    navigationConfigKey
                                )}
                            >
                                {
                                    this.state.navigationDictionary[0][dictionaryKey][0][
                                        navigationConfigKey
                                    ].text
                                }
                            </span>
                        </span>
                        <div className={this.props.managedClasses.navigation_itemList}>
                            {this.renderDictionaryItem(dictionaryItem.id)}
                        </div>
                    </React.Fragment>
                );
            });
        }

        if (hasContent) {
            return (
                <span
                    key={"trigger"}
                    className={this.getItemDisplayTextClassName(
                        dictionaryKey,
                        navigationConfigKey
                    )}
                    onKeyDown={this.handleTreeItemKeyDown(
                        dictionaryKey,
                        navigationConfigKey
                    )}
                    data-dictionaryid={dictionaryKey}
                    data-navigationconfigid={navigationConfigKey}
                    tabIndex={0}
                >
                    <button
                        className={this.getItemExpandTriggerClassName()}
                        onClick={this.handleToggleNavigationItem(
                            dictionaryKey,
                            navigationConfigKey
                        )}
                    />
                    <span
                        onClick={this.handleNavigationItemClick(
                            dictionaryKey,
                            navigationConfigKey
                        )}
                    >
                        {
                            this.state.navigationDictionary[0][dictionaryKey][0][
                                navigationConfigKey
                            ].text
                        }
                    </span>
                </span>
            );
        }

        return (
            <span
                key={"trigger"}
                className={this.getItemDisplayTextClassName(
                    dictionaryKey,
                    navigationConfigKey
                )}
            >
                {
                    this.state.navigationDictionary[0][dictionaryKey][0][
                        navigationConfigKey
                    ].text
                }
            </span>
        );
    }

    private renderNavigationConfigContent(
        dictionaryKey: string,
        navigationConfigKey: string,
        hasContent: boolean
    ): React.ReactNode {
        if (hasContent) {
            return (
                <div
                    key={"content"}
                    className={this.props.managedClasses.navigation_itemList}
                    role={"group"}
                    aria-expanded={true}
                >
                    {this.state.navigationDictionary[0][dictionaryKey][0][
                        navigationConfigKey
                    ].items.map((navigationConfigItemKey: string) => {
                        return this.renderNavigationConfig(
                            dictionaryKey,
                            navigationConfigItemKey
                        );
                    })}
                </div>
            );
        }

        return [];
    }

    /**
     * Toggles the items by adding/removing them from the openItems array
     */
    private handleToggleNavigationItem = (
        dictionaryKey: string,
        navigationConfigKey: string
    ): (() => void) => {
        return (): void => {
            const isNavigationConfigItemExpanded: boolean =
                this.state.expandedNavigationConfigItems[dictionaryKey] &&
                this.state.expandedNavigationConfigItems[dictionaryKey].findIndex(
                    (value: string) => {
                        return value === navigationConfigKey;
                    }
                ) !== -1;
            const updatedNavigationConfigItems: { [key: string]: string[] } = this.state
                .expandedNavigationConfigItems;

            if (!isNavigationConfigItemExpanded) {
                if (Array.isArray(updatedNavigationConfigItems[dictionaryKey])) {
                    updatedNavigationConfigItems[dictionaryKey] = [
                        navigationConfigKey,
                    ].concat(updatedNavigationConfigItems[dictionaryKey]);
                } else {
                    updatedNavigationConfigItems[dictionaryKey] = [navigationConfigKey];
                }
            } else {
                updatedNavigationConfigItems[
                    dictionaryKey
                ] = updatedNavigationConfigItems[dictionaryKey].filter(
                    (value: string) => {
                        return value !== navigationConfigKey;
                    }
                );
            }

            this.setState({
                expandedNavigationConfigItems: updatedNavigationConfigItems,
            });
        };
    };

    /**
     * Update the active item
     */
    private handleNavigationItemClick = (
        dictionaryKey: string,
        navigationConfigKey: string
    ): (() => void) => {
        return (): void => {
            this.props.messageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: dictionaryKey,
                activeNavigationConfigId: navigationConfigKey,
            });
        };
    };

    private getExpandedState(
        dictionaryKey: string,
        navigationConfigKey: string
    ): boolean {
        return !!(
            this.state.expandedNavigationConfigItems[dictionaryKey] &&
            this.state.expandedNavigationConfigItems[dictionaryKey].findIndex(
                (value: string) => {
                    return navigationConfigKey === value;
                }
            ) !== -1
        );
    }

    // /**
    //  * Handles the hovering of an element when dragging
    //  */
    // private handleDragHover = (
    //     dragHoverDataLocation: string,
    //     direction?: VerticalDragDirection
    // ): void => {
    //     const state: Partial<NavigationState> = {
    //         dragHoverDataLocation,
    //         dragHoverBeforeDataLocation:
    //             direction === VerticalDragDirection.up ? dragHoverDataLocation : null,
    //         dragHoverAfterDataLocation:
    //             direction === VerticalDragDirection.down ? dragHoverDataLocation : null,
    //         dragHoverCenterDataLocation:
    //             direction === VerticalDragDirection.center ? dragHoverDataLocation : null,
    //     };

    //     if (
    //         this.state.dragHoverDataLocation !== state.dragHoverDataLocation ||
    //         this.state.dragHoverAfterDataLocation !== state.dragHoverAfterDataLocation ||
    //         this.state.dragHoverBeforeDataLocation !==
    //             state.dragHoverBeforeDataLocation ||
    //         this.state.dragHoverCenterDataLocation !== state.dragHoverCenterDataLocation
    //     ) {
    //         this.setState(state as NavigationState);
    //     }
    // };

    private findCurrentTreeItemIndex(
        nodes: HTMLElement[],
        dictionaryId: string,
        navigationConfigId: string
    ): number {
        return nodes.findIndex((node: HTMLElement) => {
            return (
                node.dataset.dictionaryid === dictionaryId &&
                node.dataset.navigationconfigid === navigationConfigId
            );
        });
    }

    private focusNextTreeItem(dictionaryKey: string, navigationConfigKey: string): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryKey,
                navigationConfigKey
            );
            const nextIndex: number =
                currentIndex !== -1 && currentIndex !== nodes.length - 1
                    ? currentIndex + 1
                    : nodes.length - 1;
            nodes[nextIndex].focus();
        }
    }

    private focusPreviousTreeItem(
        dictionaryKey: string,
        navigationConfigKey: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryKey,
                navigationConfigKey
            );
            const previousIndex: number =
                currentIndex !== -1 && currentIndex !== 0 ? currentIndex - 1 : 0;
            nodes[previousIndex].focus();
        }
    }

    private focusFirstTreeItem(): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();

            nodes[0].focus();
        }
    }

    private focusLastTreeItem(): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();

            nodes[nodes.length - 1].focus();
        }
    }

    private focusAndOpenTreeItems(
        dictionaryKey: string,
        navigationConfigKey: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryKey,
                navigationConfigKey
            );
            const ariaExpanded: string = get(
                nodes[currentIndex],
                'parentElement.attributes["aria-expanded"].value'
            );

            if (
                nodes[currentIndex].tagName !== "A" &&
                ariaExpanded === "true" &&
                nodes[currentIndex + 1]
            ) {
                nodes[currentIndex + 1].focus();
            } else if (ariaExpanded === "false") {
                this.handleToggleNavigationItem(dictionaryKey, navigationConfigKey)();
            }
        }
    }

    private focusAndCloseTreeItems(
        dictionaryKey: string,
        navigationConfigKey: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryKey,
                navigationConfigKey
            );
            const ariaExpanded: string = get(
                nodes[currentIndex],
                'parentElement.attributes["aria-expanded"].value'
            );

            if (nodes[currentIndex].tagName === "A") {
                const parent: HTMLElement = get(
                    nodes[currentIndex],
                    "parentElement.parentElement.firstChild"
                );

                parent.focus();
            } else if (ariaExpanded === "false") {
                nodes[currentIndex - 1].focus();
            } else if (ariaExpanded === "true") {
                this.handleToggleNavigationItem(dictionaryKey, navigationConfigKey)();
            }
        }
    }

    private getItemLinkClassName(
        dictionaryKey: string,
        navigationConfigKey: string
    ): (dragging: boolean) => string {
        return (dragging: boolean): string => {
            let classes: string = this.props.managedClasses.navigation_item;

            if (this.props.dragAndDropReordering) {
                classes = `${classes} ${get(
                    this.props,
                    "managedClasses.navigation_item__draggable",
                    ""
                )}`;

                if (dragging) {
                    classes = `${classes} ${get(
                        this.props,
                        "managedClasses.navigation_item__dragging",
                        ""
                    )}`;
                }
            }

            if (
                this.state.activeItem[0] === dictionaryKey &&
                this.state.activeItem[1] === navigationConfigKey
            ) {
                classes = `${classes} ${
                    this.props.managedClasses.navigation_itemText__active
                }`;
            }

            return classes;
        };
    }

    private getItemContentClassName(): () => string {
        return (): string => {
            return this.props.managedClasses.navigation_item;
        };
    }

    private getItemExpandTriggerClassName(): string {
        return get(this.props, "managedClasses.navigation_itemExpandTrigger", "");
    }

    private getItemDisplayTextClassName(
        dictionaryKey: string,
        navigationConfigKey: string
    ): string {
        let classes: string = this.props.managedClasses.navigation_itemText;

        if (
            dictionaryKey === this.state.activeItem[0] &&
            navigationConfigKey === this.state.activeItem[1]
        ) {
            classes = `${classes} ${
                this.props.managedClasses.navigation_itemText__active
            }`;
        }

        return classes;
    }

    // private getItemContentDragHoverClassName = (
    //     type: NavigationDataType,
    //     verticalDragDirection?: VerticalDragDirection
    // ): string => {
    //     let classNames: string = "";

    //     if (
    //         verticalDragDirection === VerticalDragDirection.center &&
    //         (type === NavigationDataType.children ||
    //             type === NavigationDataType.component ||
    //             type === NavigationDataType.primitiveChild)
    //     ) {
    //         classNames += `${get(
    //             this.props,
    //             "managedClasses.navigation_itemContent__dragHover",
    //             ""
    //         )}`;
    //     } else if (
    //         typeof verticalDragDirection !== "undefined" &&
    //         verticalDragDirection !== VerticalDragDirection.center
    //     ) {
    //         classNames += ` ${
    //             verticalDragDirection === VerticalDragDirection.up
    //                 ? this.getItemContentDragHoverBeforeClassName()
    //                 : this.getItemContentDragHoverAfterClassName()
    //         }`;
    //     }

    //     return classNames;
    // };

    // private getItemContentDragHoverBeforeClassName = (): string => {
    //     return `${get(
    //         this.props,
    //         "managedClasses.navigation_itemContent__dragHoverBefore",
    //         ""
    //     )}`;
    // };

    // private getItemContentDragHoverAfterClassName = (): string => {
    //     return `${get(
    //         this.props,
    //         "managedClasses.navigation_itemContent__dragHoverAfter",
    //         ""
    //     )}`;
    // };

    private getTreeItemNodes(): HTMLElement[] {
        const nodes: HTMLElement[] = Array.from(
            this.rootElement.current.querySelectorAll(
                "a[role='treeitem'], div[role='treeitem'] > span"
            )
        );
        return nodes.filter((node: HTMLElement) => node.offsetParent !== null);
    }

    /**
     * Handles key up on a tree item
     */
    private handleTreeItemKeyDown = (
        dictionaryKey: string,
        navigationConfigKey: string
    ): ((e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>) => void) => {
        return (e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>): void => {
            e.preventDefault();

            if (e.target === e.currentTarget) {
                switch (e.keyCode) {
                    case keyCodeEnter:
                    case keyCodeSpace:
                        if (e.target === e.currentTarget) {
                            this.handleToggleNavigationItem(
                                dictionaryKey,
                                navigationConfigKey
                            )();
                            this.handleNavigationItemClick(
                                dictionaryKey,
                                navigationConfigKey
                            )();
                        }
                        break;
                    case keyCodeArrowDown:
                        this.focusNextTreeItem(dictionaryKey, navigationConfigKey);
                        break;
                    case keyCodeArrowUp:
                        this.focusPreviousTreeItem(dictionaryKey, navigationConfigKey);
                        break;
                    case keyCodeArrowRight:
                        this.focusAndOpenTreeItems(dictionaryKey, navigationConfigKey);
                        break;
                    case keyCodeArrowLeft:
                        this.focusAndCloseTreeItems(dictionaryKey, navigationConfigKey);
                        break;
                    case keyCodeHome:
                        this.focusFirstTreeItem();
                        break;
                    case keyCodeEnd:
                        this.focusLastTreeItem();
                        break;

                    // default:
                    //     if (e.key.toLowerCase() === "d" && e.ctrlKey) {
                    //         e.preventDefault();
                    //         this.duplicateCurrentItem(dataLocation, type);
                    //     }
                    //     break;
                }
            }
        };
    };
}
