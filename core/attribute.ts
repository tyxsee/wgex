import { TypeArray } from "./types";

export class Attribute {

    location: number
    type: string
    data: TypeArray

    constructor(location: number, type: string, data?: TypeArray) {
        this.location = location;
        this.type = type;
        this.data = Array.isArray(data) ? new Float32Array(data) : data
    }
}
