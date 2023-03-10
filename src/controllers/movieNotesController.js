const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

class movieNotesController {
  async create(request, response) {
    const { title, description, rating, tagName } = request.body
    const { user_id } = request.params

    const movieRate = Array(rating)
    const movieRates = ["1", "2", "3", "4", "5"]
    const rateOk = movieRates.some((rate) => movieRate.includes(rate))

    if(!rateOk) {
       throw new AppError("O valor de rating do filme vai de 1 a 5")
      }
    
    const movieNotes = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id
    })

    const movieTag = Array(tagName)
    const movieTagClassification = ["Ação", "Aventura", "Biográfico", "Comédia", "Fantasia", "Musical", "Ficção", "Romance", "Terror"]
    const tagOk= movieTagClassification.some((tag) => movieTag.includes(tag))

    if(!tagOk) {
      throw new AppError(" A Tag de classificação dos filmes deverá ser escolhida entre os itens: Ação, Aventura, Biográfico, Comédia, Fantasia, Musical, Ficção, Romance, Terror")
    }

    const movieTagsInsert = movieNotes.map(() => {
      return {
        movieNotes_id: movieNotes,
        user_id,
        tagName
      }
    })

    await knex("movieTags").insert(movieTagsInsert)

    response.json() 

  }

  async showMovies(request, response) {
    const { id } = request.params

    const movieNote = await knex("movieNotes").where({id}).first()
    const movieTag = await knex("movieTags").where({user_id:id}).orderBy("tagName")
    
    return response.json({
      ...movieNote,
      movieTag
    })
  }

  async delete(request, response) {
    const { id, movieNotes_id } = request.params
    await knex("movieNotes").where({ id }).delete()

    return response.json()    
  }

  async indexMovies(request, response){
    const { user_id , title, rating, tagName } = request.query

    let notes

    if(tagName){
      const filterMovieTags = tagName.split(",").map(tag => tag.trim())

      notes = await knex("movieTags")
        .select([
          "movieNotes.id",
          "movieNotes.title",
          "movieNotes.rating",
          "movieTags.tagName",
          "movieNotes.user_id"
        ])
        .where("movieNotes.user_id", user_id)
        .whereLike("movieNotes.title", `%${title}%`)
        .whereIn("tagName", filterMovieTags)
        .innerJoin("movieNotes", "movieNotes.id", "movieTags.movieNotes_id")
      
    } else {
      notes = await knex("movieNotes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title")
      }
    
    const userTags = await knex("movieTags").where({ user_id})
    const { movieNotes_id, filterMovieTags } = request.query
    const movieNotesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.movieNotes_id === movieNotes_id)

      return {
        ...note,
        movieTags: filterMovieTags
      }
    })

    return response.json(movieNotesWithTags)

  }
}

module.exports = movieNotesController