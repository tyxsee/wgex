/**
 * bind group layout 
 */
import { Context } from './context'

export class PipelineLayout {

    context: Context
    handle: GPUPipelineLayout

    constructor(context: Context, bindGroupLayouts: BindGroupLayout[]) {
        this.context = context
        this.handle = this.context.device.createPipelineLayout({
            label: 'shader: pipeline createPipelineLayout',
            bindGroupLayouts: bindGroupLayouts.map(item => {
                return item.handle
            }),
        });
    }

}
