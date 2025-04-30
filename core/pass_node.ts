import { BindGroup } from "./bind_group";
import { IndexState } from "./index_state";
import { Pipeline } from "./pipeline";
import { VertexState } from "./vertex_state";

type PassNodeParams = {
    pipeline: Pipeline
    bindGroups?: BindGroup[];
    vertexStates?: VertexState[]
    indexState?: IndexState
    drawCount?: number
    instanceCount?: number
    firstIndex?: number
    baseVertex?: number
    firstInstance?: number

    workGroupX?: number
    workGroupY?: number
    workGroupZ?: number
    once?: boolean
}

/**
 * sub pass
 */
export class PassNode {

    pipeline: Pipeline
    bindGroups?: BindGroup[];
    vertexStates?: VertexState[]
    indexState?: IndexState
    drawCount?: number
    instanceCount?: number
    firstIndex?: number
    baseVertex?: number
    firstInstance?: number
    //
    workGroupX?: number
    workGroupY?: number
    workGroupZ?: number
    //
    once: boolean
    enable: boolean

    constructor(params: PassNodeParams) {
        this.pipeline = params.pipeline;
        this.bindGroups = params.bindGroups ?? [];
        //render pass
        this.vertexStates = params.vertexStates ?? [];
        this.indexState = params.indexState;
        this.drawCount = params.drawCount;
        this.instanceCount = params.instanceCount ?? 1;
        this.firstIndex = params.firstIndex ?? 0;
        this.baseVertex = params.baseVertex ?? 0;
        this.firstInstance = params.firstInstance ?? 0;
        //compute pass
        this.workGroupX = params.workGroupX ?? 64;
        this.workGroupY = params.workGroupY ?? 1;
        this.workGroupZ = params.workGroupZ ?? 1;
        this.once = params.once ?? false
        this.enable = true;
    }

    execute(passEncoder: GPURenderPassEncoder | GPUComputePassEncoder) {

        if (!this.enable) return;
        if (this.once) this.enable = false;
        
        for (let i = 0; i < this.bindGroups.length; i++) {
            let bindGroup = this.bindGroups[i];
            bindGroup && passEncoder.setBindGroup(i, bindGroup.handle);
        }
        // this.bindGroups.forEach((bindGroup, index) => {
        //     bindGroup && passEncoder.setBindGroup(index, bindGroup.handle);
        // });

        if (this.isRenderPassEncoder(passEncoder)) {
            let encoder = <GPURenderPassEncoder>passEncoder
            encoder.setPipeline(this.pipeline.handle as GPURenderPipeline);

            if (this.vertexStates) {
                for (let i = 0; i < this.vertexStates.length; i++) {
                    let binding = this.vertexStates[i];
                    binding && encoder.setVertexBuffer(i, binding.binding.buffer.handle,
                        binding.binding.offset, binding.binding.size
                    );
                }
            }
            if (this.indexState) {
                encoder.setIndexBuffer(this.indexState.binding.buffer.handle, this.indexState.format,
                    this.indexState.binding.offset, this.indexState.binding.size);
                encoder.drawIndexed(this.drawCount, this.instanceCount, this.firstIndex, this.baseVertex, this.firstInstance);
            } else {
                encoder.draw(this.drawCount, this.instanceCount, this.firstIndex, this.firstInstance);
            }

        } else {
            let encoder = <GPUComputePassEncoder>passEncoder
            encoder.setPipeline(this.pipeline.handle as GPUComputePipeline);
            encoder.dispatchWorkgroups(this.workGroupX, this.workGroupY, this.workGroupZ)
        }

    }

    isRenderPassEncoder(passEncoder: GPURenderPassEncoder | GPUComputePassEncoder): boolean {
        return passEncoder instanceof GPURenderPassEncoder;
    }
}
