const generateMessage = (text, isURL = false) => {
    return {
        text,
        createdAt: new Date().getTime(),
        isURL
    }
}

module.exports = { generateMessage }
