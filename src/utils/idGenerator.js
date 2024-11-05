const IdGenerator = {
    generateUserId: () => {
        return Math.floor(1000 + Math.random() * 9000)
    },
    generateCode: () => {
        const code = Math.floor(100000 + Math.random() * 900000)
        return code.toString()
    },
    generateId: () => {
        const id = Math.floor(1000 + Math.random() * 9000)
        return id.toString()
    }
}


export default IdGenerator;