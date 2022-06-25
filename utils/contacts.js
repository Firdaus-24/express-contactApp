const fs = require('fs');

const dirPath = './data'

if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

const dataPath = './data/contacs.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]',
        'utf-8')
}

const loadContact = () => {
    const file = fs.readFileSync('./data/contacts.json', 'utf-8');
    const contacts = JSON.parse(file);
    return contacts;
}
const findContact = (nama) => {
    const contacs = loadContact()
    const contact = contacs.find((contact) => contact.nama.toLowerCase() == nama.toLowerCase())
    return contact
}

// menimpa data baru 
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

// menambahkan data baru 
const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

// cek nama yang duplikat
const cekDuplikat = (nama) => {
    const contacts = loadContact()
    return contacts.find((contact) => contact.nama.toLowerCase() == nama.toLowerCase())
}

module.exports = {
    loadContact,
    findContact,
    addContact,
    cekDuplikat
}