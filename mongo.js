const mongoose = require('mongoose');


const password = process.argv[2];

const connectionStr = `mongodb+srv://noahy_schmid:${password}@fullstack-course.zarik1b.mongodb.net/?retryWrites=true&w=majority&appName=Fullstack-Course`;

mongoose.set('strictQuery', false)
mongoose.connect(connectionStr)

const phonebookEntrySchema = new mongoose.Schema({
    name: String,
    number: String
});

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema);

const listAllEntries = () => {
    PhonebookEntry.find({}).then(result => {
        console.log('phonebook:');
        if (result.length === 0) {
            console.log('-- empty --');
        }
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`);
        });
        mongoose.connection.close();
    });
};

const addEntry = (name, number) => {
    const entry = new PhonebookEntry({
        name,
        number
    });

    entry.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
};

if (process.argv.length === 3) {
    listAllEntries();
} else if (process.argv.length === 5) {
    addEntry(process.argv[3], process.argv[4]);
}