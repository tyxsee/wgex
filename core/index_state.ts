import { Buffer } from "./buffer";
import { BufferBinding } from "./buffer_binding";
import { Context } from "./context";
import { arrayNeedsUint32 } from "./utils";
import { TypeArray } from "./types";

export class IndexState {

    context: Context
    index: TypeArray
    format: GPUIndexFormat
    binding: BufferBinding

    constructor(context: Context, index: TypeArray) {
        this.context = context;
        this.updateIndexBuffer(index);
    }

    updateIndexBuffer(data: TypeArray) {
        let index = new (arrayNeedsUint32(data) ? Uint32Array : Uint16Array)(data);
        let binding = new BufferBinding(Buffer.createIndex(this.context, index));
        this.format = <GPUIndexFormat>index.constructor.name.slice(0, 6).toLowerCase();
        this.binding = binding
    }

}
