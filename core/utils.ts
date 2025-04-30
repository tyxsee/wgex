import { TypeArray } from './types';

/**
 * max value
 */
export function mathMax(x: number, y: number) {
    return x ^ ((x ^ y) & -(x < y));
}

/**
 * min value
 */
export function mathMin(x: number, y: number) {
    return y ^ ((x ^ y) & -(x < y));
}

/**
 * bytes alignments
 * @param {number} size 
 * @returns {number}
 */
export function byteAlign(size: number, align: number = 4): number {
    if ((align & (align - 1)) !== 0) {
        throw 'align must be multiple of 2'
    }
    return (size + align - 1) & ~(align - 1)
}


/**
 * calculate mipmap levels for given size
 * @param {number} width 
 * @param {number} height 
 */
export function numMipLevels(width: number, height: number): number {
    const maxSize = mathMax(width, height);
    return 1 + Math.log2(maxSize) | 0;
}

/**
 * 
 * isMultisampled
 * @private
 */
export function isMultisampled(type: string): boolean {
    return type == 'texture_multisampled_2d<f32>' ||
        type == 'texture_multisampled_2d<i32>' ||
        type == 'texture_multisampled_2d<u32>' ||
        type == 'texture_depth_multisampled_2d';

}
/**
 * texture view dimension
 * @private
 */
export function getTextureViewDimension(type: string): GPUTextureViewDimension {
    switch (type) {
        case 'texture_1d<f32>':
        case 'texture_1d<i32>':
        case 'texture_1d<u32>':
        case 'texture_storage_1d':
            return '1d';

        case 'texture_2d<f32>':
        case 'texture_2d<i32>':
        case 'texture_2d<u32>':
        case 'texture_multisampled_2d<f32>':
        case 'texture_multisampled_2d<i32>':
        case 'texture_multisampled_2d<u32>':
        case 'texture_depth_2d':
        case 'texture_depth_multisampled_2d':
        case 'texture_storage_2d':
            return '2d';

        case 'texture_2d_array<f32>':
        case 'texture_2d_array<i32>':
        case 'texture_2d_array<u32>':
        case 'texture_depth_2d_array':
        case 'texture_storage_2d_array':
            return '2d-array';

        case 'texture_3d<f32>':
        case 'texture_3d<i32>':
        case 'texture_3d<u32>':
        case 'texture_storage_3d':
            return '3d';

        case 'texture_cube<f32>':
        case 'texture_cube<i32>':
        case 'texture_cube<u32>':
        case 'texture_depth_cube':
            return 'cube';

        case 'texture_cube_array<f32>':
        case 'texture_cube_array<i32>':
        case 'texture_cube_array<u32>':
        case 'texture_depth_cube_array':
            return 'cube-array';

        default:
            return '2d'
            break;
    }
}
/**
 * sample type
 * @private
 */
export function getSampleType(type: string): GPUTextureSampleType {
    switch (type) {
        case 'texture_1d<f32>':
        case 'texture_2d<f32>':
        case 'texture_2d_array<f32>':
        case 'texture_3d<f32>':
        case 'texture_cube<f32>':
        case 'texture_cube_array<f32>':
        case 'texture_multisampled_2d<f32>':
            return 'float';

        case 'texture_1d<i32>':
        case 'texture_2d<i32>':
        case 'texture_2d_array<i32>':
        case 'texture_3d<i32>':
        case 'texture_cube<i32>':
        case 'texture_cube_array<i32>':
        case 'texture_multisampled_2d<i32>':
            return 'sint';

        case 'texture_1d<u32>':
        case 'texture_2d<u32>':
        case 'texture_2d_array<u32>':
        case 'texture_3d<u32>':
        case 'texture_cube<u32>':
        case 'texture_cube_array<u32>':
        case 'texture_multisampled_2d<u32>':
            return 'uint';

        case 'texture_depth_2d':
        case 'texture_depth_2d_array':
        case 'texture_depth_cube':
        case 'texture_depth_cube_array':
        case 'texture_depth_multisampled_2d':
            return 'depth'

        default:
            return 'float';
            break;
    }
}
/**
 * compare type
 * @private
 */
export function bindingType(type: string): GPUSamplerBindingType {
    switch (type) {
        case 'sampler':
            return 'filtering'
        case 'sampler_comparison':
            return 'comparison';
        default:
            return 'filtering'
            break;
    }
}


const b = {
    i32: { format: 'sint32', numElements: 1, align: 4, size: 4, type: 'i32', view: Int32Array },
    u32: { format: 'uint32', numElements: 1, align: 4, size: 4, type: 'u32', view: Uint32Array },
    f32: { format: 'float32', numElements: 1, align: 4, size: 4, type: 'f32', view: Float32Array },
    f16: { format: 'float16', numElements: 1, align: 2, size: 2, type: 'u16', view: Uint16Array },

    vec2f: { format: 'float32x2', numElements: 2, align: 8, size: 8, type: 'f32', view: Float32Array },
    vec2i: { format: 'sint32x2', numElements: 2, align: 8, size: 8, type: 'i32', view: Int32Array },
    vec2u: { format: 'uint32x2', numElements: 2, align: 8, size: 8, type: 'u32', view: Uint32Array },
    vec2h: { format: 'float16x2', numElements: 2, align: 4, size: 4, type: 'u16', view: Uint16Array },
    vec3i: { format: 'sint32x3', numElements: 3, align: 16, size: 12, type: 'i32', view: Int32Array },
    vec3u: { format: 'uint32x3', numElements: 3, align: 16, size: 12, type: 'u32', view: Uint32Array },
    vec3f: { format: 'float32x3', numElements: 3, align: 16, size: 12, type: 'f32', view: Float32Array },
    vec3h: { format: 'float16x3', numElements: 3, align: 8, size: 6, type: 'u16', view: Uint16Array },
    vec4i: { format: 'sint32x4', numElements: 4, align: 16, size: 16, type: 'i32', view: Int32Array },
    vec4u: { format: 'uint32x4', numElements: 4, align: 16, size: 16, type: 'u32', view: Uint32Array },
    vec4f: { format: 'float32x4', numElements: 4, align: 16, size: 16, type: 'f32', view: Float32Array },
    vec4h: { format: 'float16x4', numElements: 4, align: 8, size: 8, type: 'u16', view: Uint16Array },

    // AlignOf(vecR)	SizeOf(array<vecR, C>)
    mat2x2f: { numElements: 4, align: 8, size: 16, type: 'f32', view: Float32Array },
    mat2x2h: { numElements: 4, align: 4, size: 8, type: 'u16', view: Uint16Array },
    mat3x2f: { numElements: 6, align: 8, size: 24, type: 'f32', view: Float32Array },
    mat3x2h: { numElements: 6, align: 4, size: 12, type: 'u16', view: Uint16Array },
    mat4x2f: { numElements: 8, align: 8, size: 32, type: 'f32', view: Float32Array },
    mat4x2h: { numElements: 8, align: 4, size: 16, type: 'u16', view: Uint16Array },
    mat2x3f: { numElements: 8, align: 16, size: 32, pad: [3, 1], type: 'f32', view: Float32Array },
    mat2x3h: { numElements: 8, align: 8, size: 16, pad: [3, 1], type: 'u16', view: Uint16Array },
    mat3x3f: { numElements: 12, align: 16, size: 48, pad: [3, 1], type: 'f32', view: Float32Array },
    mat3x3h: { numElements: 12, align: 8, size: 24, pad: [3, 1], type: 'u16', view: Uint16Array },
    mat4x3f: { numElements: 16, align: 16, size: 64, pad: [3, 1], type: 'f32', view: Float32Array },
    mat4x3h: { numElements: 16, align: 8, size: 32, pad: [3, 1], type: 'u16', view: Uint16Array },
    mat2x4f: { numElements: 8, align: 16, size: 32, type: 'f32', view: Float32Array },
    mat2x4h: { numElements: 8, align: 8, size: 16, type: 'u16', view: Uint16Array },
    mat3x4f: { numElements: 12, align: 16, size: 48, pad: [3, 1], type: 'f32', view: Float32Array },
    mat3x4h: { numElements: 12, align: 8, size: 24, pad: [3, 1], type: 'u16', view: Uint16Array },
    mat4x4f: { numElements: 16, align: 16, size: 64, type: 'f32', view: Float32Array },
    mat4x4h: { numElements: 16, align: 8, size: 32, type: 'u16', view: Uint16Array },
};
/**
 * base type 
 * @private
 */
export const TypeInfo = Object.freeze({
    ...b,
    'vec2<i32>': b.vec2i,
    'vec2<u32>': b.vec2u,
    'vec2<f32>': b.vec2f,
    'vec2<f16>': b.vec2h,
    'vec3<i32>': b.vec3i,
    'vec3<u32>': b.vec3u,
    'vec3<f32>': b.vec3f,
    'vec3<f16>': b.vec3h,
    'vec4<i32>': b.vec4i,
    'vec4<u32>': b.vec4u,
    'vec4<f32>': b.vec4f,
    'vec4<f16>': b.vec4h,

    'mat2x2<f32>': b.mat2x2f,
    'mat2x2<f16>': b.mat2x2h,
    'mat3x2<f32>': b.mat3x2f,
    'mat3x2<f16>': b.mat3x2h,
    'mat4x2<f32>': b.mat4x2f,
    'mat4x2<f16>': b.mat4x2h,
    'mat2x3<f32>': b.mat2x3f,
    'mat2x3<f16>': b.mat2x3h,
    'mat3x3<f32>': b.mat3x3f,
    'mat3x3<f16>': b.mat3x3h,
    'mat4x3<f32>': b.mat4x3f,
    'mat4x3<f16>': b.mat4x3h,
    'mat2x4<f32>': b.mat2x4f,
    'mat2x4<f16>': b.mat2x4h,
    'mat3x4<f32>': b.mat3x4f,
    'mat3x4<f16>': b.mat3x4h,
    'mat4x4<f32>': b.mat4x4f,
    'mat4x4<f16>': b.mat4x4h,
});

/**
 * interleave type array
 * @param ResultConstructor 
 * @param elements 
 * @param arrays 
 * @returns {TypeArray}
 */
export function interleaveTypeArrays(ResultConstructor, elements: number[], ...arrays: number[][]) {
    const totalLength = arrays.reduce((total, arr) => {
        return total + arr.length
    }, 0);
    const result = new ResultConstructor(totalLength);
    const stride = elements.reduce((a: number, b: number) => a + b);

    for (let i = 0; i < totalLength; i++) {
        let offset = 0;
        for (let j = 0; j < elements.length; j++) {
            for (let k = 0; k < elements[j]; k++) {
                result[i * stride + offset] = arrays[j][elements[j] * i + k];
                offset++;
            }
        }
    }
    return result;
}

/**
 * Checks if the array contains any value that is greater than or equal to 65535.
 * This function is useful to determine if a 32-bit unsigned integer (Uint32) is needed
 * to store the array values instead of a 16-bit unsigned integer (Uint16).
 */
export function arrayNeedsUint32(array: number[] | TypeArray) {
    for (let i = array.length - 1; i >= 0; --i) {
        if (array[i] >= 65535) return true; // account for PRIMITIVE_RESTART_FIXED_INDEX,
    }
    return false;
}
