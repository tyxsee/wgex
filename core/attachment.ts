
import { Texture } from './texture';
import { LoadOp, StoreOp } from './types';

type AttachmentParams = {
    loadOp?: LoadOp;
    storeOp?: StoreOp;
    clearValue?: number | number[];
    texture?: Texture;
    resolveTexture?: Texture;
}

/**
 * render attachment
 */
export class Attachment {
    public loadOp?: LoadOp
    public storeOp?: StoreOp
    public clearValue?: number | number[]

    public texture?: Texture;
    public resolveTexture?: Texture;
    private readOnly: boolean = true;

    constructor(params?: AttachmentParams) {
        this.loadOp = params?.loadOp ?? LoadOp.clear;
        this.storeOp = params?.storeOp ?? StoreOp.store;
        this.clearValue = params?.clearValue ?? [1, 0, 0, 1]

        this.texture = params?.texture ?? undefined
        this.resolveTexture = params?.resolveTexture ?? undefined
    }


    clearColor(v: number[]) {
        this.clearValue = v;
    }

    clearDepth(depth: number) {
        this.clearValue = depth;
    }

    /**
     * update texture
     */
    setTexture(texture: Texture) {
        if (!this.texture || this.texture !== texture) {
            // this.texture.destroy()   //do not do anything stupid
            this.texture = texture
        }
    }
    /**
     * update resolve texture
     */
    setResolveTexture(resolveTexture: Texture) {
        if (!this.resolveTexture || this.resolveTexture !== resolveTexture) {
            // this.resolveTexture?.destroy()
            this.resolveTexture = resolveTexture
        }
    }

    getColorAttachmentDescriptor() {
        let descriptor = {
            view: this.texture.createView(),
            clearValue: this.clearValue,
            loadOp: this.loadOp,
            storeOp: this.storeOp,
            resolveTarget: undefined
        }
        if (this.resolveTexture) {
            descriptor.resolveTarget = this.resolveTexture.createView();
        }
        return descriptor
    }

    getDepthAttachmentDescriptor() {
        return {
            view: this.texture.createView(),
            depthClearValue: this.clearValue,
            depthLoadOp: this.loadOp,
            depthStoreOp: this.storeOp,
            depthReadyOnly: this.readOnly
        }
    }

    getStencilAttachmentDescriptor() {
        return {
            view: this.texture.createView(),
            stencilClearValue: this.clearValue,
            stencilLoadOp: this.loadOp,
            stencilStoreOp: this.storeOp,
            stencilReadOnly: this.readOnly
        }
    }
}
