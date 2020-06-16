const express = require('express')
const app = express()
app.use(express.json())

var morgan = require('morgan')
app.use(morgan('tiny'))
morgan.token('POST', 
  function (req, res) { return JSON.stringify(req.body) })

var cors=require('cors')
app.use(cors())

let pb = [
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Pekka",
    "number": "121212",
    "id": 5
  }
]

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${pb.length} people <p/>${new Date()}`)
})


app.get('/api/persons', (req, res) => {
  res.json(pb)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const entry = pb.find(e => e.id === id)
  if (entry) {
    res.json(entry)
  } else {
    res.status(404).end()
  }
})

const genId = () => { 
  return (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) 
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(body)
  const entry = {
    name: body.name,
    number: body.number,
    id: genId()
  }
  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  }
  if (pb.find((e) => e.name === body.name)) {
    return res.status(400).json({ 
      error: 'duplicate name' 
    })
  }


  pb = pb.concat(entry)

  res.json(entry)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  pb = pb.filter(e => e.id !== id)
  res.status(204).end()
  
})


app.get('/api/persons/')
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})