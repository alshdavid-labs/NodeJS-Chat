var Conversation = require('./conversation')

var newConvo = new Conversation(1, ['john', 'steve'])

newConvo.addMessage('steve', 'sdasdadsasd')
newConvo.addMessage('steve', 'sdasdadsasd1')
newConvo.addMessage('steve', 'sdasdadsasd2')

console.log(newConvo.getMessages())