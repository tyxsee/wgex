
/**
 * type array
 */
export type TypeArray = Int8Array | Uint8Array | Uint8ClampedArray | Uint16Array | Int16Array | Float32Array | Uint32Array | Int32Array;

/**
 * depth compare
 */
export enum DepthCompare {
    'never' = 'never',
    'less' = 'less',
    'equal' = 'equal',
    'less-equal' = 'less-equal',
    'greater' = 'greater',
    'not_equal' = 'not-equal',
    'greater_equal' = 'greater-equal',
    'always' = 'always',
}
/**
 * sample type
 */
export enum SamplerType {
    'sampler_comparison' = 'comparison',
}
/**
 * buffer usage
 */
export enum BufferUsage {
    MAP_READ = 0x0001,
    MAP_WRITE = 0x0002,
    COPY_SRC = 0x0004,
    COPY_DST = 0x0008,
    INDEX = 0x0010,
    VERTEX = 0x0020,
    UNIFORM = 0x0040,
    STORAGE = 0x0080,
    INDIRECT = 0x0100,
    QUERY_RESOLVE = 0x0200,
}

/**
 * shader stage
 */
export enum ShaderStage {
    VERTEX = 0x1,
    FRAGMENT = 0x2,
    RENDER = 0x3,
    COMPUTE = 0x4,
}

/**
 * texture usgae
 */
export enum TextureUsage {
    CopySrc = 1,
    CopyDst = 2,
    TextureBinding = 4,
    StorageBinding = 8,
    RenderAttachment = 16
}
/**
 * texture format
 */
export enum TextureFormat {
    // 8-bit formats
    'r8unorm' = 'r8unorm',
    'r8snorm' = 'r8snorm',
    'r8uint' = 'r8uint',
    'r8sint' = 'r8sint',

    // 16-bit formats
    'r16uint' = 'r16uint',
    'r16sint' = 'r16sint',
    'r16float' = 'r16float',
    'rg8unorm' = 'rg8unorm',
    'rg8snorm' = 'rg8snorm',
    'rg8uint' = 'rg8uint',
    'rg8sint' = 'rg8sint',

    // 32-bit formats
    'r32uint' = 'r32uint',
    'r32sint' = 'r32sint',
    'r32float' = 'r32float',
    'rg16uint' = 'rg16uint',
    'rg16sint' = 'rg16sint',
    'rg16float' = 'rg16float',
    'rgba8unorm' = 'rgba8unorm',
    'rgba8unorm-srgb' = 'rgba8unorm-srgb',
    'rgba8snorm' = 'rgba8snorm',
    'rgba8uint' = 'rgba8uint',
    'rgba8sint' = 'rgba8sint',
    'bgra8unorm' = 'bgra8unorm',
    'bgra8unorm-srgb' = 'bgra8unorm-srgb',
    // Packed 32-bit formats
    'rgb9e5ufloat' = 'rgb9e5ufloat',
    'rgb10a2uint' = 'rgb10a2uint',
    'rgb10a2unorm' = 'rgb10a2unorm',
    'rg11b10ufloat' = 'rg11b10ufloat',

    // 64-bit formats
    'rg32uint' = 'rg32uint',
    'rg32sint' = 'rg32sint',
    'rg32float' = 'rg32float',
    'rgba16uint' = 'rgba16uint',
    'rgba16sint' = 'rgba16sint',
    'rgba16float' = 'rgba16float',

    // 128-bit formats
    'rgba32uint' = 'rgba32uint',
    'rgba32sint' = 'rgba32sint',
    'rgba32float' = 'rgba32float',

    // Depth/stencil formats
    'stencil8' = 'stencil8',
    'depth16unorm' = 'depth16unorm',
    'depth24plus' = 'depth24plus',
    'depth24plus-stencil8' = 'depth24plus-stencil8',
    'depth32float' = 'depth32float',

    // 'depth32float-stencil8' feature
    'depth32float-stencil8' = 'depth32float-stencil8',

    // BC compressed formats usable if 'texture-compression-bc' is both
    // supported by the device/user agent and enabled in requestDevice.
    'bc1_rgba_unorm' = 'bc1-rgba-unorm',
    'bc1_rgba_unorm_srgb' = 'bc1-rgba-unorm-srgb',
    'bc2_rgba_unorm' = 'bc2-rgba-unorm',
    'bc2_rgba_unorm_srgb' = 'bc2-rgba-unorm-srgb',
    'bc3_rgba_unorm' = 'bc3-rgba-unorm',
    'bc3_rgba_unorm_srgb' = 'bc3-rgba-unorm-srgb',
    'bc4_r_unorm' = 'bc4-r-unorm',
    'bc4_r_snorm' = 'bc4-r-snorm',
    'bc5_rg_unorm' = 'bc5-rg-unorm',
    'bc5_rg_snorm' = 'bc5-rg-snorm',
    'bc6h_rgb_ufloat' = 'bc6h-rgb-ufloat',
    'bc6h_rgb_float' = 'bc6h-rgb-float',
    'bc7_rgba_unorm' = 'bc7-rgba-unorm',
    'bc7_rgba_unorm_srgb' = 'bc7-rgba-unorm-srgb',

    // ETC2 compressed formats usable if 'texture-compression-etc2' is both
    // supported by the device/user agent and enabled in requestDevice.
    'etc2_rgb8unorm' = 'etc2-rgb8unorm',
    'etc2_rgb8unorm_srgb' = 'etc2-rgb8unorm-srgb',
    'etc2_rgb8a1unorm' = 'etc2-rgb8a1unorm',
    'etc2_rgb8a1unorm_srgb' = 'etc2-rgb8a1unorm-srgb',
    'etc2_rgba8unorm' = 'etc2-rgba8unorm',
    'etc2_rgba8unorm_srgb' = 'etc2-rgba8unorm-srgb',
    'eac_r11unorm' = 'eac-r11unorm',
    'eac_r11snorm' = 'eac-r11snorm',
    'eac_rg11unorm' = 'eac-rg11unorm',
    'eac_rg11snorm' = 'eac-rg11snorm',

    // ASTC compressed formats usable if 'texture-compression-astc' is both
    // supported by the device/user agent and enabled in requestDevice.
    'astc_4x4_unorm' = 'astc-4x4-unorm',
    'astc_4x4_unorm_srgb' = 'astc-4x4-unorm-srgb',
    'astc_5x4_unorm' = 'astc-5x4-unorm',
    'astc_5x4_unorm_srgb' = 'astc-5x4-unorm-srgb',
    'astc_5x5_unorm' = 'astc-5x5-unorm',
    'astc_5x5_unorm_srgb' = 'astc-5x5-unorm-srgb',
    'astc_6x5_unorm' = 'astc-6x5-unorm',
    'astc_6x5_unorm_srgb' = 'astc-6x5-unorm-srgb',
    'astc_6x6_unorm' = 'astc-6x6-unorm',
    'astc_6x6_unorm_srgb' = 'astc-6x6-unorm-srgb',
    'astc_8x5_unorm' = 'astc-8x5-unorm',
    'astc_8x5_unorm_srgb' = 'astc-8x5-unorm-srgb',
    'astc_8x6_unorm' = 'astc-8x6-unorm',
    'astc_8x6_unorm_srgb' = 'astc-8x6-unorm-srgb',
    'astc_8x8_unorm' = 'astc-8x8-unorm',
    'astc_8x8_unorm_srgb' = 'astc-8x8-unorm-srgb',
    'astc_10x5_unorm' = 'astc-10x5-unorm',
    'astc_10x5_unorm_srgb' = 'astc-10x5-unorm-srgb',
    'astc_10x6_unorm' = 'astc-10x6-unorm',
    'astc_10x6_unorm_srgb' = 'astc-10x6-unorm-srgb',
    'astc_10x8_unorm' = 'astc-10x8-unorm',
    'astc_10x8_unorm_srgb' = 'astc-10x8-unorm-srgb',
    'astc_10x10_unorm' = 'astc-10x10-unorm',
    'astc_10x10_unorm_srgb' = 'astc-10x10-unorm-srgb',
    'astc_12x10_unorm' = 'astc-12x10-unorm',
    'astc_12x10_unorm_srgb' = 'astc-12x10-unorm-srgb',
    'astc_12x12_unorm' = 'astc-12x12-unorm',
    'astc_12x12_unorm_srgb' = 'astc-12x12-unorm-srgb',
}

/**
 * renderable texture format
 */
const renderableFormats = new Set([
    'r8unorm', 'r16float', 'r32float'
    , 'rg8unorm', 'rg16float', 'rg32float'
    , 'rgba8unorm', 'rgba8unorm-srgb', 'bgra8unorm', 'bgra8unorm-srgb'
    , 'rgb10a2unorm', 'rgba16float', 'rgba32float'
]);

/**
 * @function
 */
export function isTextureRenderable(format: string | TextureFormat): boolean {
    return renderableFormats.has(format)
}

/**
 * depth compare function
 */
export enum CompareFunction {
    'never' = 'never',
    'less' = 'less',
    'equal' = 'equal',
    'less_equal' = 'less-equal',
    'greater' = 'greater',
    'not_equal' = 'not-equal',
    'greater_equal' = 'greater-equal',
    'always' = 'always',
}

/**
 * stencil operation
 */
export enum StencilOperation {
    'keep' = 'keep',
    'zero' = 'zero',
    'replace' = 'replace',
    'invert' = 'invert',
    'increment_clamp' = 'increment-clamp',
    'decrement_clamp' = 'decrement-clamp',
    'increment_wrap' = 'increment-wrap',
    'decrement_wrap' = 'decrement-wrap',
}

/**
 * stencil face state
 */
export type StencilFaceState = {
    compare: CompareFunction,
    failOp: StencilOperation,
    depthFailOp: StencilOperation,
    passOp: StencilOperation,
};

/**
 * load operation
 */
export enum LoadOp {
    'load' = 'load',
    'clear' = 'clear',
};

/**
 * store operation
 */
export enum StoreOp {
    'store' = 'store',
    'discard' = 'discard',
};

