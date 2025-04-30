import { PassNode } from './pass_node';
/**
 * render pass encoder or computer pass encoder, depends on whether there is a  renderDescriptor
 */
export class Pass {

    renderDescriptor?: GPURenderPassDescriptor
    nodes: PassNode[]

    constructor(renderDescriptor?: GPURenderPassDescriptor) {
        this.renderDescriptor = renderDescriptor;
        this.nodes = [];
    }

    updateRenderDescriptor(renderDescriptor: GPURenderPassDescriptor) {
        this.renderDescriptor = renderDescriptor;
    }

    clear() {
        this.nodes.length = 0
    }

    remove(passNode: PassNode) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i] !== passNode) continue
            this.nodes.splice(i, 1)
            return;
        }
    }

    add(passNode: PassNode) {
        this.nodes.push(passNode)
    }

    execute(commandEncoder: GPUCommandEncoder) {

        if (this.nodes.length === 0) return;

        const passEncoder = this.renderDescriptor ?
            commandEncoder.beginRenderPass(this.renderDescriptor)
            : commandEncoder.beginComputePass({ label: 'compute pass encoder' })

        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            node.execute(passEncoder);
        }
        passEncoder.end();
    }
}
