const express = require('express');
const app = express();
const port = 3000;

// hello whoever is reading this :)
// i wanted to do it the right way using mongoo and a better structure like organizing routes and files
// adding filters to the search and all maybe even create a frontend
// but due to limited time due to having exams next week
// all i could due is this
// enjoy

app.use(express.json());

// superheroes array
let superheroes = [
    {
        id: 1,
        name: 'Batman',
        gender: 'male',
        strength: 50,
        speed: 60,
        intelligence: 100,
    },
];

//******* some helper functions ******/

// checks if obect with specified id exists
function isValideId(id) {
    return superheroes.some((el) => el.id == id);
}

// checks if passed object contains all required fields
function isNotValideBody(data) {
    // gotta check if it does have additional fields but got no time for that
    return (
        data.name === undefined ||
        data.gender === undefined ||
        data.strength === undefined ||
        data.speed === undefined ||
        data.intelligence === undefined
    );
}

function generateNewId() {
    if (superheroes.length == 0) return 1;
    return superheroes[superheroes.length - 1].id + 1;
}

function deleteSuperheroFromArray(id) {
    superheroes = superheroes.filter((sh) => sh.id != id);
}

function addSuperheroToArray(data, id) {
    data.id = parseInt(id || generateNewId());
    superheroes.push(data);
}

//******* routes ******/

// search route : returns superhero object if id passed in params exists otherwise returns an empty object
app.get('/search/:id', (req, res) => {
    res.send(
        JSON.stringify(superheroes.filter((sh) => sh.id == req.params.id)[0]) ||
            {}
    );
});

// returns array of all superheroes objects
app.get('/all', (req, res) => {
    res.send(JSON.stringify(superheroes));
});

// add route : adds passed object to the array of superheroes
app.post('/add', (req, res) => {
    const data = req.body;
    // checks if body not valide
    if (isNotValideBody(data)) {
        return res.send(
            JSON.stringify({ success: false, error: 'invalide hero object' })
        );
    }
    // valide body case
    addSuperheroToArray(data);
    res.send(JSON.stringify({ success: true, data: data }));
});

app.post('/modify/:id', (req, res) => {
    const data = req.body;
    // checks if body not valide
    if (isNotValideBody(data)) {
        return res.send(
            JSON.stringify({ success: false, error: 'invalide hero object' })
        );
    }
    // checks if id exists
    if (!isValideId(req.params.id)) {
        return res.send(
            JSON.stringify({ success: false, error: 'invalide id' })
        );
    }
    // modifying the specified object
    deleteSuperheroFromArray(req.params.id); // delete old object
    addSuperheroToArray(data, req.params.id); // add new one with same old id
    res.send(JSON.stringify({ success: true, superheroes }));
});

app.post('/delete/:id', (req, res) => {
    // check if id exists
    if (!isValideId(req.params.id)) {
        return res.send(
            JSON.stringify({ success: false, error: 'invalide id' })
        );
    }
    deleteSuperheroFromArray(req.params.id);
    res.send(JSON.stringify({ success: true, superheroes }));
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
