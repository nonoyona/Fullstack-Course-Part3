const express = require("express");

const app = express();

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


app.get("/info", (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${data.length} people</p><p>${date}</p>`);
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});