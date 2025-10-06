const express = require("express")
const path = require("path")
const app = express()
const user = require("./mongodb")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "login.html"))
})

app.get("/cadastro", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "cadastro.html"))
})

app.post("/cadastro", async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    try {
        await user.insertMany([data])

        res.redirect("/")
    } catch (err) {
        console.error("Erro ao cadastrar:", err)
        res.status(500).send("Erro ao cadastrar usuário.")
    }
})

app.post("/login", async (req, res) => {
    try {
        const check = await user.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.redirect("./pages/index.html")
        } else {
            res.send("Senha ou usuário inválidos")
        }

    } catch (err) {
        console.error("Erro no login:", err)
        res.status(500).send("Erro interno no login")
    }
})

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000")
})
