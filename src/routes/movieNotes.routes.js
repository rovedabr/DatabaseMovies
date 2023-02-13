const { Router } = require("express")

const MovieNotesController = require("../controllers/movieNotesController")

const movieNotesRoutes = Router()

const movieNotesController = new MovieNotesController()

movieNotesRoutes.post("/:user_id", movieNotesController.create)
movieNotesRoutes.get("/:id", movieNotesController.showMovies)
movieNotesRoutes.delete("/:id", movieNotesController.delete)

module.exports = movieNotesRoutes
