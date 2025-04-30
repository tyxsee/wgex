import { Context } from "./context";
import { Pass } from "./pass";

// CommandEncoder
export class CommandEncoder {

    private context: Context
    private passes: Pass[]

    constructor(context: Context) {
        this.context = context;
        this.passes = [];
    }

    addPass(pass: Pass) {
        this.passes.push(pass);
    }

    encodeCommands() {
        const commandEncoder = this.context.device.createCommandEncoder();
        for (let pass of this.passes) {
            pass.execute(commandEncoder);
        }
        return commandEncoder.finish();
    }

    async submit() {
        const commandBuffer = this.encodeCommands();
        this.context.device.queue.submit([commandBuffer]);
        await this.context.device.queue.onSubmittedWorkDone()
    }

}
