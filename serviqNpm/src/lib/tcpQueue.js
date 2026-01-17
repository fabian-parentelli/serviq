import { TcpPersistence } from './tcpPersistence.js';

class TcpQueue {

    constructor(id) {
        this.id = id;
        this.messages = [];
        this.isWritable = true;
        this.persistence = new TcpPersistence(this.id);
        this._loadFromDisk();
    };

    _loadFromDisk() {
        const savedMessages = this.persistence.getAll();
        if (savedMessages.length > 0) this.messages = savedMessages;
    };

    push(msg) {
        if (!this.isWritable) return false;
        const messageToStore = { ...msg, storedIn: this.id };
        this.messages.push(messageToStore);
        this.persistence.save(messageToStore);
        return true;
    };

    removeById(cid) {
        this.messages = this.messages.filter(m => m.cid !== cid);
        this.persistence.remove(cid);
    };

    getByService(target) {

        const toDeliver = [];
        const toKeep = [];

        for (const msg of this.messages) {
            if (msg.to === target) {
                toDeliver.push(msg);
                this.persistence.remove(msg.cid);
            } else toKeep.push(msg);
        };
        this.messages = toKeep;
        return toDeliver;
    };


    getSummary() {
        const deadLetterCount = this.persistence.connection.prepare(
            'SELECT COUNT(*) as count FROM dead_letter'
        ).get().count;

        return {
            id: this.id,
            inMemory: this.messages.length,
            inDisk: this.persistence.getAll().length,
            deadLetter: deadLetterCount,
            isWritable: this.isWritable
        };
    };

};

export { TcpQueue };