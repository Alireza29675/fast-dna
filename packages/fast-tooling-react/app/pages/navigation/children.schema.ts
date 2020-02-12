import { navigationDictionaryLink } from "../../../src";

export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with children",
    description: "A test component's schema definition.",
    type: "object",
    id: "children",
    properties: {
        object: {
            title: "Object",
            type: "object",
            properties: {
                children: {
                    title: "Object Children",
                    type: "array",
                    [navigationDictionaryLink]: true,
                },
            },
        },
        array: {
            title: "Array",
            type: "array",
            items: {
                title: "Object",
                type: "object",
                properties: {
                    children: {
                        title: "Array Children",
                        type: "array",
                        [navigationDictionaryLink]: true,
                    },
                },
            },
        },
        children: {
            title: "Children",
            type: "array",
            [navigationDictionaryLink]: true,
        },
    },
};
