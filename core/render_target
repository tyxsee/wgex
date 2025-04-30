import { Context } from './context'
import { Texture } from './texture'
import { TextureFormat } from './types'
import { Attachment } from './attachment'

export class RenderTarget {

    static createDefault(context: Context): RenderTarget {
        let colorAttachments = [
            new Attachment({
                texture: context.getCurrentTexture(),
                clearValue: [0.4, 0.4, 0.4, 1]
            })
        ];
        let depthAttachment = new Attachment({
            texture: new Texture(context, {
                label: 'depth texture',
                size: context.presentationSize,
                format: TextureFormat.depth24plus,
            }),
            clearValue: 1
        })
        return new RenderTarget(colorAttachments, depthAttachment)
    }

    public colorAttachments: Attachment[]
    public depthAttachment?: Attachment

    constructor(colors = [], depth = undefined) {
        this.colorAttachments = colors;
        this.depthAttachment = depth;
    }

    addColorAttachment(attachment: Attachment) {
        this.colorAttachments.push(attachment)
    }

    setDepthAttachment(attachment: Attachment) {
        this.depthAttachment = attachment;
    }

    /**
     * render pass descriptor
     */
    getRenderDescriptor(label?: string): GPURenderPassDescriptor {
        let colorAttachments = []
        if (this.colorAttachments.length) {
            for (let i = 0, len = this.colorAttachments.length; i < len; i++) {
                colorAttachments.push(this.colorAttachments[i].getColorAttachmentDescriptor())
            }
        }
        let depthStencilAttachment = undefined
        if (this.depthAttachment) {
            depthStencilAttachment = this.depthAttachment.getDepthAttachmentDescriptor()
        }
        return {
            label,
            colorAttachments,
            depthStencilAttachment
        }
    }
    /**
     * create GPUColorTargetState sequence
     */
    getColorTargets(blend?: unknown): Array<GPUColorTargetState> {
        let colors = [];
        for (let i = 0, len = this.colorAttachments.length; i < len; i++) {
            colors.push({
                format: this.colorAttachments[i].texture.format,
                belnd: blend,
            })
        }
        return colors
    }

    getDepthStencilState(depthStencil: unknown): GPUDepthStencilState {
        let depthStencilState = undefined;
        if (this.depthAttachment) {
            depthStencilState = Object.assign({
                format: this.depthAttachment.texture.format,
                depthCompare: 'less',
                depthWriteEnabled: true,
            }, depthStencil ?? {})
        }
        return depthStencilState
    }

    getMultiSampleState(multiSample: unknown) {
        let multiSampleState = undefined;
        //make sure sample count must same in all attachments

        //
        multiSampleState = Object.assign({
            count: 1,
            mask: 0xFFFFFFFF,
            alphaToCoverageEnabled: false,
        }, multiSample ?? {})
        return multiSampleState
    }
}
