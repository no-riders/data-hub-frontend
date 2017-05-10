const express = require('express')
const axios = require('axios')
const Sniffr = require('sniffr')

const config = require('../config')
const controllerUtils = require('../lib/controllerutils')

const router = express.Router()

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function postToZen (ticket) {
  return axios.post(config.zenUrl, { ticket },
    {
      auth: {
        username: `${config.zenEmail}/token`,
        password: config.zenToken
      }
    }
  )
}

function getBug (req, res) {
  const data = (req.body && req.body.length > 0) ? req.body : {}

  const sniffr = new Sniffr()
  sniffr.sniff(req.headers['user-agent'])
  data.browser = `${capitalize(sniffr.browser.name)} ${sniffr.browser.version[0]}.${sniffr.browser.version[1]} - ${capitalize(sniffr.os.name)} ${sniffr.os.version[0]}.${sniffr.os.version[1]}`
  data.csrfToken = controllerUtils.genCSRF(req, res)
  res.render('support/bug', {data, errors: req.errors})
}

function checkForm (req) {
  const errors = {}
  if (!!req.body.email && !req.body.email.match(/.*@.*\..*/)) {
    errors.email = 'A valid email address is required'
  }

  if (!req.body.title) {
    errors.title = 'Your feedback needs a title'
  }

  if (!req.body.type) {
    errors.type = 'You need to choose between raising a bug and leaving feedback'
  }
  return errors
}

function postBug (req, res) {
  const errors = checkForm(req)
  if (Object.keys(errors).length > 0) {
    req.errors = errors
    return getBug(req, res)
  }
  const ticket = {
    requester: {
      email: (req.body.email && req.body.email.length > 0) ? req.body.email : 'Anonymous'
    },
    subject: req.body.title,
    comment: {
      body: (req.body.description && req.body.description.length > 0) ? req.body.description : 'N/A'
    },
    custom_fields: [
      {id: config.zenBrowser, value: req.body.browser},
      {id: config.zenService, value: 'datahub_export'}
    ],
    tags: [req.body.type]
  }
  return postToZen(ticket)
    .then(({data}) => {
      req.flash('success-message', `Created new bug, reference number ${data.ticket.id}`)
      res.redirect('/support/thank')
    })
}

function thank (req, res) {
  res.render('support/thank')
}

router.get('/bug', getBug)
router.post('/bug', postBug)
router.get('/thank', thank)

module.exports = { router }