const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json())
app.use(morgan("tiny"));


let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get("/api/persons", (req, res) => {
    res.json(data);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = data.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ message: "Person not found" });
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!data.find(person => person.id === id)) {
        return res.status(404).json({ message: "Person not found" });
    }
    data = data.filter(person => person.id !== id);
    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    console.log("Called POST with body:", body);
    if (!body || !body.name || !body.number) {
        return res.status(400).json({ message: "Name or number is missing" });
    }
    if (data.find(person => person.name === body.name)) {
        return res.status(400).json({ message: "Name must be unique" });
    }
    let id = Math.floor(Math.random() * 1000000)+1;
    const person = {
        id: id,
        name: body.name,
        number: body.number
    };
    data = data.concat(person);
    res.json(person);
});


app.get("/info", (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${data.length} people</p><p>${date}</p>`);
});



app.listen(3001, () => {
    console.log("Server is running on port 3001");
});