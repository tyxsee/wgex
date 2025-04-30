import { Shader } from './wgsl/shader';
import { Context } from './context';
import { BindGroupLayout } from './bind_group_layout';
import { RenderTarget } from './render_target';
import { PipelineLayout } from './pipeline_layout';

type PrimitiveState = {
    topology?: string,
    frontFace?: string,
    cullMode?: string
}
type DepthStencilState = {
    depthWriteEnabled: boolean,
    format: string,
    depthCompare: string,

    stencilFront?: unknown,
    stencilBack?: unknown,

    stencilReadMask?: number,
    stencilWriteMask?: number,

    depthBias?: number,
    depthBiasSlopeScale?: number,
    depthBiasClamp?: number,
}
type BlendState = {
    color?: {}
    alpha?: {}
}

type PipelineParams = {
    label?: string
    shader: Shader,
    pipelineLayout: PipelineLayout
    bindGroupLayout: BindGroupLayout[]
    renderTarget?: RenderTarget
    bufferLayouts?: GPUVertexBufferLayout[],
    vertexEntryPoint?: string
    fragmentEntryPoint?: string
    computeEntryPoint?: string

    primitive?: PrimitiveState,
    blend?: BlendState,
    depthStencil?: DepthStencilState,
}

export class Pipeline {
    context: Context
    label: string
    shader: Shader
    pipeline: GPURenderPipeline | GPUComputePipeline
    //
    pipelineLayout: PipelineLayout
    renderTarget?: RenderTarget //renderTarget means render pipeline
    bufferLayouts: GPUVertexBufferLayout[]
    vertexEntryPoint?: string
    fragmentEntryPoint?: string
    computeEntryPoint?: string

    primitive?: PrimitiveState
    blend?: BlendState
    depthStencil?: DepthStencilState

    constructor(context: Context, params: PipelineParams) {
        this.context = context;
        this.label = params.label;
        this.shader = params.shader;
        this.pipelineLayout = params.pipelineLayout;
        this.renderTarget = params.renderTarget;
        this.bufferLayouts = params.bufferLayouts;
        this.vertexEntryPoint = params.vertexEntryPoint;
        this.fragmentEntryPoint = params.fragmentEntryPoint;
        this.computeEntryPoint = params.computeEntryPoint;

        this.primitive = params.primitive;
        this.blend = params.blend;
        this.depthStencil = params.depthStencil;
    }

    get handle() {
        this.update()
        return this.pipeline
    }

    update() {

        if (this.pipeline) return;
        const device = this.context.device;

        if (this.renderTarget) {
            //render pipeline
            this.pipeline = device.createRenderPipeline(<GPURenderPipelineDescriptor>{
                label: this.label,
                layout: this.shader.pipelineLayout?.handle ?? 'auto',
                vertex: {
                    module: this.shader.shaderModule,
                    entryPoint: this.vertexEntryPoint ?? this.shader.vertexEntryPoint,
                    buffers: this.bufferLayouts
                },
                fragment: {
                    module: this.shader.shaderModule,
                    entryPoint: this.fragmentEntryPoint ?? this.shader.fragmentEntryPoint,
                    targets: this.renderTarget.getColorTargets(this.blend)
                },
                primitive: {
                    topology: (this.primitive?.topology ?? 'triangle-list') as GPUPrimitiveTopology,
                    frontFace: (this.primitive?.frontFace ?? 'ccw') as GPUFrontFace,
                    cullMode: (this.primitive?.cullMode ?? 'none') as GPUCullMode,
                },
                depthStencil: this.renderTarget.getDepthStencilState(this.depthStencil),
                multisample: {
                    count: 1
                }
            });
        } else {
            //compute pipeline
            this.pipeline = device.createComputePipeline(<GPUComputePipelineDescriptor>{
                label: this.label,
                layout: this.shader.pipelineLayout.handle,
                compute: {
                    module: this.shader.shaderModule,
                    entryPoint: this.computeEntryPoint ?? this.shader.computeEntryPoint,
                    constants: {}
                }
            });
        }

    }
}
