import { linkedDataPluginId, pluginIdKeyword } from "./keywords";

export default {
    [pluginIdKeyword]: linkedDataPluginId,
    type: "array",
    items: {
        type: "object",
        properties: {
            id: {
                title: "The ID of the data corresponding to a dictionary key",
                type: "string",
            },
        },
    },
};
