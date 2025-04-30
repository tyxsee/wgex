import { Context } from './context';
import { Resource } from './resource';

type SamplerParams = {

}
export class Sampler extends Resource {

    private gpuSampler: GPUSampler;
    private samplerDescriptor: SamplerParams

    constructor(context: Context, params?: SamplerParams) {
        super(context)
        this.samplerDescriptor = Object.assign({
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
            addressModeW: 'clamp-to-edge',
            lodMinClamp: 0,
            lodMaxClamp: 32,
            compare: undefined,
            maxAnisotropy: 1,
        }, params ?? {});
        this.gpuSampler = this.context.device.createSampler(this.samplerDescriptor)
    }

    get handle() {
        return this.gpuSampler
    }

}
