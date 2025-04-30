
import { Buffer } from "./buffer";
import { Resource } from "./resource";

export class BufferBinding extends Resource {
    buffer?: Buffer;
    offset: number;
    size: number;

    constructor(buffer?: Buffer, offset: number = 0, size?: number) {
        super(undefined);
        this.buffer = buffer;
        this.offset = offset;
        this.size = size ?? this.buffer.size;
    }

}
