import { storiesOf } from "@storybook/react";
import React from "react";
import Toolbar from "./";
import ToolbarItemGroup from "../toolbar-item-group";
import Button from "../button";

storiesOf("Toolbar", module)
    .add("Default", () => (
        <Toolbar>
            <Button>Item 1</Button>
            <button>Item 2</button>
            <button>Item 3</button>
            <ToolbarItemGroup>
                <button>Item 4</button>
                <button>Item 5</button>
            </ToolbarItemGroup>
        </Toolbar>
    ))
    .add("Ignore disabled elements", () => (
        <Toolbar>
            <button>Item 1</button>
            <button disabled={true}>Disabled attribute</button>
            <button disabled={false}>Item 3</button>
        </Toolbar>
    ));
