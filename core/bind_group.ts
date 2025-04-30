import { BindGroupLayout } from './bind_group_layout';
import { BufferBinding } from './buffer_binding';
import { Context } from './context';
import { ExternalTexture } from './external_texture';
import { Resource } from './resource';
import { Sampler } from './sampler';
import { Texture } from './texture';

/**
 * bind group entry
 */
export class BindGroupEntry implements GPUBindGroupEntry {
    /**
     * optional, A unique name for a resource binding
     */
    name?: string;

    binding: number;
    resource: GPUBindingResource;
    constructor(binding: number, resource: Resource, name?: string) {
        this.binding = binding;
        //resource type
        if (resource instanceof BufferBinding) {
            this.resource = {
                buffer: resource.buffer.handle,
                size: resource.size,
                offset: resource.offset
            };
        } else if (resource instanceof Texture) { 
            this.resource = resource.createView();
        } else if (resource instanceof ExternalTexture) { 
            this.resource = resource.handle;
        } else if (resource instanceof Sampler) {
            this.resource = resource.handle;
        }
        this.name = name;
    }
}
/**
 * bind group
 */
export class BindGroup {

    context: Context
    handle: GPUBindGroup

    constructor(context: Context, bindGroupLayout: BindGroupLayout, entries: BindGroupEntry[], label?: string) {
        this.context = context
        this.handle = context.device.createBindGroup({
            label: label,
            entries: entries,
            layout: bindGroupLayout.handle
        })
    }

    static create(context: Context, bindGroupLayout: BindGroupLayout, resources = {}, label?: string) {
        let entries = [];
        let items = bindGroupLayout.entries;
        for (let i = 0, len = items.length; i < len; i++) {
            let item = items[i];
            let binding = resources[item.name];
            if (!binding) {
                console.error(`BindGroup: invalid resource '${item.name}'!`)
                continue;
            }
            entries.push(new BindGroupEntry(item.binding, binding, item.name))
        }
        if (items.length !== entries.length) {
            console.error('BindGroup: missed resources !')
            return;
        }
        return new BindGroup(context, bindGroupLayout, entries, label);
    }

}

