import { Texture } from './texture'
import { TextureUsage, TextureFormat } from './types'

type ContextParams = {
    canvas: HTMLCanvasElement,
    powerPreference?: string,
    usage?: number,
    format?: TextureFormat
    requiredFeatures?: GPUFeatureName[]
    requiredLimits?: Record<string, number>
}

export class Context {

    static async create(params?: ContextParams) {
        let context = new Context(params)
        await context.init()
        return context
    }

    private params?: ContextParams
    canvas: HTMLCanvasElement
    presentationSize: number[]
    // presentationFormat: GPUTextureFormat
    device: GPUDevice
    gpuContext: GPUCanvasContext
    texture?: Texture

    constructor(params?: ContextParams) {
        this.canvas = params?.canvas
        this.params = params
    }

    getCurrentTexture(): Texture | undefined {
        if (!this.texture) return undefined;
        this.texture.gpuTexture = this.gpuContext.getCurrentTexture()
        return this.texture;
    }

    async init() {
        if (!(<Navigator>navigator).gpu) {
            throw Error('WebGPU is not supported by your browser.!');
        }

        let adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance',
        });
        if (adapter == null) {
            throw Error(`cannot acquire WebGPU adapter!`);
        }

        this.device = await adapter.requestDevice({
            requiredFeatures: [     //default features

            ].concat(this.params?.requiredFeatures ?? []),
            requiredLimits: Object.assign({     //default limits

            }, this.params?.requiredLimits ?? {}),
        }) as GPUDevice;
        this.device.lost.then((info: GPUDeviceLostInfo) => {
            if ('unknonw' as GPUDeviceLostReason == info.reason) {
                console.error(`WebGPU device lost with unknown reason: ${info.message}`);;
            } else {
                console.info(`WebGPU device destroyed: ${info.message}`);;
            }
        });

        
        if (this.canvas) {
            this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
            this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;

            this.presentationSize = [this.canvas.width, this.canvas.height, 1]
            // this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();

            this.gpuContext = this.canvas.getContext('webgpu') as GPUCanvasContext;
            this.gpuContext.configure({
                device: this.device,
                format: this.params?.format ?? TextureFormat.rgba8unorm,
                usage: this.params?.usage ?? TextureUsage.RenderAttachment | TextureUsage.CopySrc,
                alphaMode: 'premultiplied', //'premultiplied' or 'opaque'
                colorSpace: 'srgb',
                toneMapping: {}
            });

            //
            let config = this.gpuContext.getConfiguration()
            this.texture = new Texture(this, {
                label: 'context.getCurrentTexture',
                size: this.presentationSize,
                usage: config.usage,
                format: config.format as TextureFormat
            })
        }

    }

}
