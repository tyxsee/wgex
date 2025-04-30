import { Context } from "./context";

export class Resource {

    context: Context

    constructor(context: Context) {
        this.context = context
    }

    destroy() {
        this.handle?.destroy();
    }
}
