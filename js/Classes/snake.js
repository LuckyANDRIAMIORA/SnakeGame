class Snake{

    constructor(tail, head){
        this.body = []
        for (let index = tail; index <= head; index++) {
            this.body.push(index)
        }
    }

    addNewSnakeHead(newHead) {
        this.body.unshift(newHead);
    }
    removeSnakeTail() {
        this.body.pop();
    }

    bodyLength(){
        return this.body.length
    }

    getIndex(index){
        return this.body[index]
    }
    
    biteItself(){
        if (this.body.lastIndexOf(this.body[0]) != -1 && this.body.lastIndexOf(this.body[0]) != 0) {
            return true
        }
    }
}
