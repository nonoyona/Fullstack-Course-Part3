const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

if (!url) {
    console.error('No MongoDB URL provided');
}

mongoose.set('strictQuery', false);
mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
});

const phonebookEntrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: (number) => {
                let parts = number.split('-');
                if (parts.length != 2) {
                    return false;
                }
                let areaCode = parts[0];
                let numberPart = parts[1];
                if (areaCode.length < 2 || areaCode.length > 3) {
                    return false;
                }
                if ((numberPart.length + areaCode.length) < 8) {
                    return false;
                }
                return true;
            },
            message: props => `${props.value} is not a valid phone number`
        }
    }
});

phonebookEntrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema);

module.exports = PhonebookEntry;