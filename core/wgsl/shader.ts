import { BindGroupLayout, BindGroupLayoutEntry, BufferBindingLayout, TextureBindingLayout, SamplerBindingLayout, ExternalTextureBindingLayout, StorageTextureBindingLayout } from '../bind_group_layout';
import { ResourceType, VariableInfo, WgslReflect } from 'wgsl_reflect/wgsl_reflect.module.js';
import { Context } from '../context';
import { bindingType, isMultisampled, getSampleType, getTextureViewDimension } from '../utils';
import { PipelineLayout } from '../pipeline_layout';

/**
 * base on WgslReflect
 */
export class Shader {
    public context: Context
    public reflection: WgslReflect
    public shaderModule: GPUShaderModule
    public bindGroupLayouts: Map<number, BindGroupLayout>
    public pipelineLayout?: PipelineLayout

    constructor(context: Context, wgsl: string) {
        this.context = context
        //shader module
        this.reflection = new WgslReflect(wgsl);
        if (this.context) {
            this.shaderModule = this.context.device.createShaderModule({
                code: wgsl,
            })
            this.bindGroupLayouts = new Map();
            this.updateBindGroupLayout()
            this.updatePipelineLayout();
        }
    }

    updatePipelineLayout() {
        if (this.bindGroupLayouts.size === 0) return;
        let layouts = []
        for (let [id, bindGroupLayout] of this.bindGroupLayouts) {
            layouts.push(bindGroupLayout)
        }
        this.pipelineLayout = new PipelineLayout(this.context, layouts)
    }

    get computeEntryPoint() {
        return this.reflection.entry.compute[0] && this.reflection.entry.compute[0].name
    }
    get vertexEntryPoint() {
        return this.reflection.entry.vertex[0].name
    }
    get fragmentEntryPoint() {
        return this.reflection.entry.fragment[0].name
    }

    get uniforms() {
        return this.reflection.uniforms;
    }
    get textures() {
        return this.reflection.textures;
    }
    get samplers() {
        return this.reflection.samplers;
    }
    get storages() {
        return this.reflection.storage;
    }

    getVariable(name: string) {

    }
    getAttribute(name: string) {
        let inputs = this.reflection.entry.vertex[0].inputs
        for (let i = 0; i < inputs.length; i++) {
            if (name === inputs[i].name) return inputs[i]
        }
        return undefined
    }
    getBindGroupLayout(index: number) {
        return this.bindGroupLayouts.get(index)
    }

    getGroupByName(name: string) {
        for (let [group, bindGroupLayout] of this.bindGroupLayouts) {
            let entries = bindGroupLayout.entries;
            for (let i = 0, len = entries.length; i < len; i++) {
                if (name === entries[i].name) return group
            }
        }
        return -1;
    }

    updateBindGroupLayout() {
        //variables
        this.bindGroupLayouts.clear()
        let groups = this.reflection.getBindGroups();
        let visibility = this.computeEntryPoint === undefined ? 3 : 4;

        for (let i = 0, length = groups.length; i < length; i++) {
            let variables = groups[i];
            if (undefined === variables) continue;

            let entries = [];
            for (let j = 0, len = variables.length; j < len; j++) {
                let variable = variables[j];
                if (undefined === variable) continue

                let entry = new BindGroupLayoutEntry(variable.binding, visibility, undefined, variable.name)
                switch (variable.resourceType) {
                    case ResourceType.Uniform:
                        entry.buffer = new BufferBindingLayout(<GPUBufferBindingType>'uniform');
                        break;
                    case ResourceType.Storage:
                        let bufferType = 'read' === variable.access ? 'read-only-storage' : 'storage';
                        entry.buffer = new BufferBindingLayout(<GPUBufferBindingType>bufferType);
                        break;
                    case ResourceType.Texture:
                        let type = `${variable.type.name}`
                        if (variable.type.format) {
                            type += `<${variable.type.format.name}>`
                        }
                        let sampleType = getSampleType(type),
                            viewDimension = getTextureViewDimension(type),
                            multisampled = isMultisampled(type);

                        entry.texture = new TextureBindingLayout(sampleType, viewDimension, multisampled);
                        break;
                    case ResourceType.Sampler:
                        let sampleBindingType = bindingType(variable.type.name)
                        entry.sampler = new SamplerBindingLayout(sampleBindingType);
                        break;
                    case ResourceType.StorageTexture:
                        let access = variable.type.access.replace('_', '-');
                        let textureAccess = access.indexOf('-') !== -1 ? access : access + '-only';
                        let format = variable.type.format.name;
                        let dimension = getTextureViewDimension(variable.type.name);
                        entry.storageTexture = new StorageTextureBindingLayout(format, textureAccess, dimension);
                        break;
                    default:
                        break;
                }
                entries.push(entry)
            }
            if (entries.length > 0) {
                let bindGroupLayout = new BindGroupLayout(this.context, entries)
                this.bindGroupLayouts.set(i, bindGroupLayout)
            }

        }

    }

}
