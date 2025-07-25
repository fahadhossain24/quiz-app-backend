import { v4 as uuidv4 } from 'uuid';

const IdGenerator = {
    generateUserId: () => {
        return Math.floor(1000 + Math.random() * 9000)
    },
    generateCode: () => {
        const code = Math.floor(1000 + Math.random() * 9000)
        return code.toString()
    },
    generateId: () => {
        // const id = Math.floor(1000 + Math.random() * 9000)
        // return id.toString()
        return uuidv4();
    }
}


export default IdGenerator;