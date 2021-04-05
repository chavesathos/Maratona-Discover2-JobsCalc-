const express = require("express")
const server = express()
const routes = require("./routes.js")
const path = require("path")

//Embedded JavaScript templating (EJS) = template engine.
server.set('view engine', 'ejs')

//Mudar a localizacao da pasta views
server.set('views', path.join(__dirname, 'views'))

//habilitar arquivos estaticos
server.use(express.static("public"))

//usar o req.body
server.use(express.urlencoded({ extended: true }))

// routes
server.use(routes)

server.listen(3000, () => console.log('rodando')) 
