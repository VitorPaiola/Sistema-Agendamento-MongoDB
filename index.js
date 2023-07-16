const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const AppointmentService = require("./services/AppointmentService");

// puxando os dados das páginas para as minhas views
app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.set("view engine", "ejs")

mongoose.connect("mongodb://127.0.0.1:27017/agendamento")

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/cadastro", (req, res) => {
    res.render("create")
})

app.post("/create", async (req, res) => {
    var status = await AppointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.cpf,
        req.body.description,
        req.body.date,
        req.body.time
    )
    if (status) {
        res.redirect("/")
    } else {
        res.send("Erro ao cadastrar")
    }
})

app.get("/getcalendar", async (req, res) => {
    // não mostrar as consultas que estão finalizadas
    var appointments = await AppointmentService.GetAll(false)
    res.json(appointments)
})

app.get("/event/:id", async (req, res) => {
    var appointment = await AppointmentService.GetById(req.params.id)
    console.log(appointment);
    res.render("event", { appo: appointment })
    // console.log(await AppointmentService.GetById(req.params.id));
    // res.json({id: req.params.id})
})

app.post("/finish", async (req, res) => {
    var id = req.body.id
    var result = await AppointmentService.Finish(id)
    res.redirect("/")

})

app.get("/list", async (req, res) => {

    //await AppointmentService.Search("232.323.232-32")

    var appos = await AppointmentService.GetAll(true)
    res.render("list", { appos })
})

app.get("/searchresult", async (req, res) => {
    var appos = await AppointmentService.Search(req.query.search)
    res.render("list", { appos })
})

app.listen(8080, () => { })