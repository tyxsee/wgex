import { Context } from "./context";
import { Buffer } from "./buffer";
import { BufferBinding } from "./buffer_binding";
import { TypeInfo, byteAlign } from './utils'
import { Struct } from "./wgsl/wgsl_ast";

type VariableParam = {
    name: string,
    type: string|Struct
}

export class UniformGroup {

    context: Context
    buffer: Buffer
    varInfos: Record<string, number>
    byteSize: number = 0
    byteOffset: number = 0
    variables: Record<string, BufferBinding>
    dirty: boolean = false

    constructor(context: Context, variables: VariableParam[]) {
        this.context = context;
        this.variables = {};
        for (let i = 0; i < variables.length; i++) {
            this.addVariable(variables[i].name, variables[i].type)
        }
        this.update();
    }

    addVariable(name: string, type: number) {
        let byteLength = TypeInfo[type].size
        this.variables[name] = new BufferBinding(null, this.byteOffset, byteLength);
        this.byteSize = this.byteOffset + byteLength;
        this.byteOffset = byteAlign(this.byteSize, 256);
        this.dirty = true;
    }

    update() {
        if (!this.dirty) return
        this.destroy();
        this.buffer = Buffer.createUniform(this.context, this.byteSize);
        for (let name in this.variables) {
            this.variables[name].buffer = this.buffer
            this.buffer.ref++;
        }
        this.dirty = false;
    }

    get(name: string) {
        this.update()
        return this.variables[name]
    }

    destroy() {
        this.buffer && this.buffer.destroy()
    }
}
