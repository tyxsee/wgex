export class Member {
    name: string
    type: string | Struct
    count: number

    constructor(name: string, type: string, count: number = 1) {
        this.name = name;
        this.type = type;
        this.count = count;
        this.update();
    }

    update() {

    }
}


export class Struct extends Member {

    members: Member[]

    constructor(name: string, members: Member[] = []) {
        super()

    }

}
