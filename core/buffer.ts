import { BufferUsage, TypeArray } from './types';
import { Context } from './context';
import { byteAlign } from './utils';
import { Resource } from './resource';

/**
 * buffer
 */
export class Buffer extends Resource {

    public static create(context: Context, dataOrSize: TypeArray | number, usage: string[], label?: string) {
        return new Buffer(context, dataOrSize, usage, label);
    }

    public static createVertex(context: Context, dataOrSize: TypeArray | number, label?: string): Buffer {
        return new Buffer(context, dataOrSize, BufferUsage.VERTEX | BufferUsage.COPY_DST, label);
    }

    public static createIndex(context: Context, dataOrSize: TypeArray | number, label?: string): Buffer {
        return new Buffer(context, dataOrSize, BufferUsage.INDEX | BufferUsage.COPY_DST, label);
    }

    public static createUniform(context: Context, dataOrSize: TypeArray | number, label?: string): Buffer {
        return new Buffer(context, dataOrSize, BufferUsage.UNIFORM | BufferUsage.COPY_DST, label);
    }

    public static createStorage(context: Context, dataOrSize: TypeArray | number, label?: string): Buffer {
        return new Buffer(context, dataOrSize, BufferUsage.STORAGE | BufferUsage.COPY_DST, label);
    }

    static copyBufferToBuffer(context: Context, srcBuffer: GPUBuffer, srcOffset: number, dstBuffer: GPUBuffer, dstOffset: number, dstSize: number) {
        const commandEncoder = context.device.createCommandEncoder();
        commandEncoder.copyBufferToBuffer(
            srcBuffer,
            srcOffset,
            dstBuffer,
            dstOffset,
            dstSize,
        );
        context.device.queue.submit([commandEncoder.finish()]);
    }

    handle: GPUBuffer;
    size: number
    ref: number = 0

    constructor(context: Context, dataOrSize: TypeArray | number, usage: BufferUsage | string[], label?: string) {
        super(context)
        let unAlignedSize = Number.isInteger(dataOrSize) ? <number>dataOrSize : (<TypeArray>dataOrSize).byteLength;
        this.size = byteAlign(unAlignedSize);
        if (Array.isArray(usage)) { //array type for usage
            let list = [...usage];
            usage = <BufferUsage>0;
            for (let s of list) {
                usage |= BufferUsage[s.toUpperCase()]
            }
        }
        this.handle = context.device.createBuffer({
            label: label,
            size: this.size,
            usage,
        });
        if ((<TypeArray>dataOrSize).buffer) {
            let data = <TypeArray>dataOrSize
            this.uploadData(0, data, data.byteOffset);
        }
        return this;
    }

    clear() {
        const commandEncoder = this.context.device.createCommandEncoder();
        commandEncoder.clearBuffer(this.handle);
        this.context.device.queue.submit([commandEncoder.finish()]);
    }

    // https://github.com/gpuweb/gpuweb/blob/main/design/BufferOperations.md
    uploadData(bufferOffset: number, data: TypeArray, offset: number = 0, size?: number): void {
        const srcArrayBuffer = data.buffer;
        size = size ?? srcArrayBuffer.byteLength;
        const byteSize = byteAlign(srcArrayBuffer.byteLength);
        // this.context.device.queue.writeBuffer(this.handle, bufferOffset, srcArrayBuffer, offset, srcArrayBuffer.byteLength)
        const srcBuffer = this.context.device.createBuffer({
            mappedAtCreation: true,
            size: byteSize,
            usage: BufferUsage.COPY_SRC,
        });
        new Uint8Array(srcBuffer.getMappedRange()).set(new Uint8Array(srcArrayBuffer, offset, size)); // memcpy
        srcBuffer.unmap();
        Buffer.copyBufferToBuffer(this.context, srcBuffer, 0, this.handle, bufferOffset, byteSize);
        srcBuffer.destroy();
    }

    copyToBuffer(srcOffset: number, dstBuffer: Buffer, dstOffset: number, dstSize: number): void {
        Buffer.copyBufferToBuffer(this.context, this.handle, srcOffset, dstBuffer.handle, dstOffset, dstSize)
    }

    //
    copyToTexture(source: GPUTexelCopyBufferInfo, destination: GPUTexelCopyTextureInfo, extent: GPUExtent3D,): void {
        const commandEncoder = this.context.device.createCommandEncoder();
        commandEncoder.copyBufferToTexture(
            {
                buffer: this.handle,
                bytesPerRow: source.bytesPerRow,
                rowsPerImage: source.rowsPerImage,
            },
            {
                texture: destination.texture.handle,
                mipLevel: destination.mipLevel ?? 0,
                origin: destination.origin ?? {},
                aspect: destination.aspect ?? "all"
            },
            extent,
        );
        this.context.device.queue.submit([commandEncoder.finish()]);
    }

    destroy(): void {
        this.handle.destroy();
        this.handle = null;
    }
}
