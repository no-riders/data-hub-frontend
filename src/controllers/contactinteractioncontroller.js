const express = require('express')
const winston = require('winston')
const Q = require('q')

const { getDisplayContactInteraction } = require('../services/interactionformattingservice')
const contactDataService = require('../services/contactdataservice')
const router = express.Router()

function getInteractions (req, res, next) {
  Q.spawn(function * () {
    try {
      res.locals.tab = 'interactions'
      const interactions = yield contactDataService.getContactInteractionsAndServiceDeliveries(req.session.token, res.locals.id)
      res.locals.displayInteractions = interactions.map(interaction => getDisplayContactInteraction(interaction))
      res.locals.addInteractionUrl = `/interaction/add?contact=${res.locals.contact.id}`

      res.render('contact/interactions')
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

router.get('/contact/:contactId/interactions', getInteractions)

module.exports = {router, getInteractions}