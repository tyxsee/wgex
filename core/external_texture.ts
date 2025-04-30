import { Context } from "./context";
import { Resource } from "./resource";

export class ExternalTexture extends Resource {

    source: HTMLVideoElement | VideoFrame
    colorSpace: string
    _handle: GPUExternalTexture

    constructor(context: Context, params: GPUExternalTextureDescriptor) {
        super(context)
        this.source = params.source;
        this.colorSpace = params.colorSpace ?? "srgb";
    }

    update() {
        this._handle = this.context.device.importExternalTexture(<GPUExternalTextureDescriptor>this);
    }

    get handle() {
        return this._handle
    }

}
