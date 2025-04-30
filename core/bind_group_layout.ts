/**
 * binding layout 
 */
import { Context } from './context'
import { TextureFormat } from './types';
export class BufferBindingLayout implements GPUBufferBindingLayout {
    constructor(public type: GPUBufferBindingType = 'uniform', public hasDynamicOffset: boolean = false, public minBindingSize: GPUSize64 = 0) { }
}

export class SamplerBindingLayout implements GPUSamplerBindingLayout {
    constructor(public type: GPUSamplerBindingType = "filtering") { }
}

export class TextureBindingLayout implements GPUTextureBindingLayout {
    constructor(public sampleType: GPUTextureSampleType = "float", public viewDimension: GPUTextureViewDimension = "2d", public multisampled: boolean = false) { }
}

export class StorageTextureBindingLayout implements GPUStorageTextureBindingLayout {
    constructor(public format: TextureFormat, public access: GPUStorageTextureAccess = "write-only", public viewDimension: GPUTextureViewDimension = "2d") { }
}

export class ExternalTextureBindingLayout implements GPUExternalTextureBindingLayout { }


type BindingLayout = BufferBindingLayout | SamplerBindingLayout | TextureBindingLayout | StorageTextureBindingLayout | ExternalTextureBindingLayout;


/**
 * bind group layout entry
 */
export class BindGroupLayoutEntry implements GPUBindGroupLayoutEntry {
    /**
     * optional, A unique name for a resource binding
     */
    name?: string

    binding: number
    visibility: number
    buffer?: BufferBindingLayout
    sampler?: SamplerBindingLayout
    texture?: TextureBindingLayout
    storageTexture?: StorageTextureBindingLayout
    externalTexture?: ExternalTextureBindingLayout

    constructor(id: number, visibility: number, layout: BindingLayout, name?: string) {
        this.binding = id;
        this.visibility = visibility;
        if (layout instanceof BufferBindingLayout) {
            this.buffer = <BufferBindingLayout>layout;
        } else if (layout instanceof SamplerBindingLayout) {
            this.sampler = <SamplerBindingLayout>layout;
        } else if (layout instanceof TextureBindingLayout) {
            this.texture = <TextureBindingLayout>layout;
        } else if (layout instanceof StorageTextureBindingLayout) {
            this.storageTexture = <StorageTextureBindingLayout>layout;
        } else if (layout instanceof ExternalTextureBindingLayout) {
            this.externalTexture = <ExternalTextureBindingLayout>layout;
        }
        this.name = name
    }
}
/**
 * bind group layout
 */
export class BindGroupLayout {

    context: Context
    entries: BindGroupLayoutEntry[]
    handle: GPUBindGroupLayout

    constructor(context: Context, entries: BindGroupLayoutEntry[], label?: string) {
        this.context = context
        this.entries = entries;
        this.handle = context.device.createBindGroupLayout({
            label: label,
            entries: entries
        })
    }
}
