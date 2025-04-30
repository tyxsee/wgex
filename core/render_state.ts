
type CullFaceState = {
    frontFace?: string,
    cullMode?: string
}
type DepthStencilState = {

}
type BlendState = {
    color?: {}
    alpha?: {}
}

export class RenderState {

    _cullFace?: CullFaceState
    _blend?: BlendState
    _depthStencil?: DepthStencilState

    constructor(params: {}) {

    }

}
