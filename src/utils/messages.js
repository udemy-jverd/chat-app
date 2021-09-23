const generateMessage = (pseudo, text, isURL = false) => {
    return {
        pseudo,
        text,
        createdAt: new Date().getTime(),
        isURL
    }
}

module.exports = { generateMessage }
