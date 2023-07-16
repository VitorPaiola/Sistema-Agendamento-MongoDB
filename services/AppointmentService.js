const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");
var mailer = require("nodemailer");

// TODO: Sempre que vc for utilizar o model do mongoose vc precisa inicializar ele
const Appo = mongoose.model("Appointment", appointment)

class AppointmentService {
    async Create(name, email, cpf, description, date, time) {
        var newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false,
            notified: false
        })
        try {
            await newAppo.save()
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async GetAll(showFinished) {
        if (showFinished) {
            // Pega todas as consultas, independente de estarem ou não finalizadas
            return await Appo.find()
        } else {
            // Pesquiso no meu banco todas as consultas, menos as que estão finalizadas
            var appos = await Appo.find({ 'finished': false })
            // Salvo essas consultas em array 
            var appointments = []

            // Percorro todas as consultas dentro desse array que vem lá do meu banco de dados
            appos.forEach(appointment => {

                if (appointment.date != undefined) {
                    // Pega o array vazio que vc criou e adiciona nele uma consulta complexa com dados simples
                    appointments.push(AppointmentFactory.Build(appointment))
                }
            })

            return appointments

        }
    }

    async GetById(id) {
        try {
            var event = await Appo.findOne({ '_id': id })
            return event
        } catch (err) {
            console.log(err);
        }
    }

    async Finish(id) {
        try {
            var id = mongoose.Types.ObjectId.fromString
            await Appo.findByIdAndUpdate(id, { finished: true })
            return true // Importante para saber se a operação foi concluída com sucesso ou não
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async Search(query) {
        try {
            var appos = await Appo.find().or([{ email: query }, { cpf: query }])
            return appos
        } catch (err) {
            console.log(err);
            return []
        }
    }

}

// TODO: Quando vc fizer um require desta classe ele já cria um novo objeto pra vc
module.exports = new AppointmentService();