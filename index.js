const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhonebookEntry = require("./database");

const app = express();


morgan.token("body", (req, res) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body);
    } else {
        return " ";
    }
});

app.use(express.static("dist"));
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(cors());


app.get("/api/persons", (req, res, next) => {
    PhonebookEntry.find({}).then(entries => {
        res.json(entries);
    }).catch(error => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    const entry = PhonebookEntry.findById(id).then(entry => {
        if (entry) {
            res.json(entry);
        } else {
            res.status(404).end();
        }
    }).catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;

    PhonebookEntry.findByIdAndDelete(id).then(() => {
        res.status(204).end();
    }).catch(error => next(error));
});

app.post("/api/persons", (req, res, next) => {
    const body = req.body;
    if (!body || !body.name || !body.number) {
        return res.status(400).json({ message: "Name or number is missing" });
    }

    const query = PhonebookEntry.findOne({ name: body.name }).then(entry => {
        if (entry) {
            return res.status(400).json({ message: "Name must be unique" });
        }

        const newEntry = new PhonebookEntry({
            name: body.name,
            number: body.number
        });
        newEntry.save().then(savedEntry => {
            res.json(savedEntry);
        }).catch(error => next(error));
    }).catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    if (!body || !body.name || !body.number) {
        return res.status(400).json({ message: "Name or number is missing" });
    }

    PhonebookEntry.findByIdAndUpdate(id, { name: body.name, number: body.number }, { runValidators: true }).then(foundEntry => {
        if (foundEntry) {
            res.json({
                name: body.name,
                number: body.number,
                id: foundEntry.id
            });
        } else {
            console.log(`Entry with id ${id} not found`);
            res.status(404).end();
        }
    }).catch(error => next(error));
});


app.get("/info", (req, res) => {
    const date = new Date();

    PhonebookEntry.find({}).then(entries => {
        res.send(`<p>Phonebook has info for ${entries.length} people</p><p>${date}</p>`);
    }).catch(error => {
        console.error("Error fetching entries:", error.message);
        res.status(500).end();
    });

});

const errorHandler = (error, req, res, next) => {
    console.error(error.message, "(", error.name, ")");
    if (error.name === "CastError") {
        return res.status(400).end();
    } else if (error.name === "ValidationError") {
        return res.status(400).json({
            message: error.message,
            kind: error.errors.name.kind,
            path: error.errors.name.path,
            value: error.errors.name.value
        });
    } else {
        return res.status(500).end();
    }
};

app.use(errorHandler);


const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
    console.log("Server is running on port 3001");
});