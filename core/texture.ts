import { Context } from './context'
import { Resource } from './resource'
import { TextureFormat, TextureUsage } from './types'
import { numMipLevels } from './utils'

type ImageSource = ImageBitmap | HTMLCanvasElement | ImageData

type TextureParams = {
    label?: string,
    source?: ImageSource,
    format?: TextureFormat,
    usage?: number,
    mipmap?: boolean,
    size?: number[]
    mipLevelCount?: number,
    textureDescriptor?: {},
    viewDescriptor?: {}
}

export class Texture extends Resource {

    static loadImage(context: Context, image: ImageSource) {
        let texture = new Texture(context, {
            size: [image.width, image.height]
        })
        texture.writeImage(image);
        return texture;
    }

    public gpuTexture?: GPUTexture
    private textureDescriptor: GPUTextureDescriptor
    private viewDescriptor: GPUTextureViewDescriptor
    public format: TextureFormat
    public mipmap: boolean
    public size: number[]
    public sampler?: {}

    constructor(context: Context, params?: TextureParams) {
        super(context)
        this.format = params?.format ?? TextureFormat.rgba8unorm
        this.mipmap = params?.mipmap ?? false
        let source = params?.source;
        if (source) {
            this.size = [source.width, source.height, 1]
        }
        this.size = params?.size ?? this.size

        let mipLevelCount = 0
        if (params?.mipLevelCount) {
            mipLevelCount = params.mipLevelCount
        } else {
            mipLevelCount = this.mipmap ? numMipLevels(this.size[0], this.size[1]) : 1;
        }

        this.textureDescriptor = Object.assign({
            label: params?.label,
            size: this.size,
            mipLevelCount: mipLevelCount,
            sampleCount: 1,
            dimension: '2d' as GPUTextureDimension,
            format: this.format,
            usage: params?.usage ?? TextureUsage.RenderAttachment | TextureUsage.TextureBinding | TextureUsage.CopyDst,
            viewFormats: []
        }, params?.textureDescriptor ?? {});

        let arrayCount = this.size[2];
        this.viewDescriptor = Object.assign({
            format: this.format,
            dimension: ((arrayCount > 1) ? '2d-array' : '2d') as GPUTextureViewDimension,
            aspect: 'all' as GPUTextureAspect,
            baseMipLevel: 0,
            mipLevelCount: mipLevelCount,
            baseArrayLayer: 0,
            arrayLayerCount: arrayCount,
        }, params?.viewDescriptor ?? {});
        this.gpuTexture = this.context.device.createTexture(this.textureDescriptor)
        if (source) {
            this.upload(source);
        }
    }

    get sampleCount() {
        return this.textureDescriptor.sampleCount
    }

    get handle() {
        return this.gpuTexture
    }

    set handle(handle: GPUTexture) {
        this.destroy()
        this.gpuTexture = handle
    }

    createView(viewDescriptor?: GPUTextureViewDescriptor): GPUTextureView {
        viewDescriptor = viewDescriptor ?? this.viewDescriptor
        return this.handle.createView(viewDescriptor);
    }

    destroy() {
        if (!this.gpuTexture) return
        this.gpuTexture.destroy();
        this.gpuTexture = undefined
    }

    upload(source) {

    }

    writeImage(image: ImageSource) {
        this.context.device.queue.copyExternalImageToTexture(
            {
                source: image,
                flipY: true
            },
            {
                texture: this.handle,
                origin: [0, 0, 0]
            },
            {
                width: image.width,
                height: image.height
            }
        );
    }

    writeBuffer(destination: GPUTexelCopyTextureInfo, buffer: ArrayBuffer, dataLayout: Record<string, number>, size: Record<string, number>) {
        destination.texture = this.handle
        this.context.device.queue.writeTexture(
            destination,
            buffer,
            {
                bytesPerRow: dataLayout.bytesPerRow,
                rowsPerImage: dataLayout.rowsPerImage,
            },
            { width: size.width, height: size.height, depthOrArrayLayers: size.depthOrArrayLayers }
        )
    }


    copyToTexture(source, destination, size) {
        const device = this.context.device;
        let commandEncoder = device.createCommandEncoder();
        commandEncoder.copyTextureToTexture(
            {
                texture: this.handle,
                mipLevel: source.mipLevel ?? 0,
                origin: source.origin ?? [0, 0, 0],
                aspect: source.aspect ?? 'all'
            },
            {
                texture: destination.texture.handle,
                mipLevel: destination.mipLevel ?? 0,
                origin: destination.origin ?? [0, 0, 0],
                aspect: source.aspect ?? 'all'
            },
            size
        );
        device.queue.submit([commandEncoder.finish()]);
        commandEncoder = null;
    }

    copyToBuffer(source: GPUTexelCopyTextureInfo, destination: GPUTexelCopyBufferInfo, copySize: GPUExtent3D) {
        const device = this.context.device;
        let commandEncoder = device.createCommandEncoder();
        commandEncoder.copyTextureToTexture(
            {
                texture: this.handle,
                mipLevel: source.mipLevel ?? 0,
                origin: source.origin ?? [0, 0, 0],
                aspect: source.aspect ?? 'all'
            },
            {
                texture: destination.texture.handle,
                mipLevel: destination.mipLevel ?? 0,
                origin: destination.origin ?? [0, 0, 0],
                aspect: source.aspect ?? 'all'
            },
            { width: size.width, height: size.height, depthOrArrayLayers: size.depthOrArrayLayers }
        );
        device.queue.submit([commandEncoder.finish()]);
        commandEncoder = null;
    }

    readPixels(x: number = 0, y: number = 0, width: number = 1, height: number = 1, mipLevel = 0) {

    }


}

