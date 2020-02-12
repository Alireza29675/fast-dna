import { BreadcrumbItemEventHandler } from "../form.props";
import { TreeNavigation } from "../../message-system/navigation.props";
import { DataType } from "../../data-utilities/types";

export interface BreadcrumbItem {
    href: string;
    text: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type HandleBreadcrumbClick = (
    dictionaryId: string,
    navigationConfigId: string
) => BreadcrumbItemEventHandler;

/**
 * Gets breadcrumbs from navigation items
 */
export function getBreadcrumbs(
    navigation: TreeNavigation,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick
): BreadcrumbItem[] {
    let navigationItems: BreadcrumbItem[] = [];

    // Arrays do not need to be represented in breadcrumbs
    // as the array items are shown at the same level as
    // other simple controls
    if (navigation[navigationConfigId].type !== DataType.array) {
        navigationItems.push({
            href: navigation[navigationConfigId].self,
            text: navigation[navigationConfigId].text,
            onClick: handleClick(dictionaryId, navigationConfigId),
        });
    }

    if (navigation[navigation[navigationConfigId].parent]) {
        navigationItems = navigationItems.concat(
            getBreadcrumbs(
                navigation,
                dictionaryId,
                navigation[navigationConfigId].parent,
                handleClick
            )
        );
    }

    return navigationItems.reverse();
}
