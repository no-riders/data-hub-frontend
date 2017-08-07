/* eslint camelcase: 0 */
const interactionLabels = require('../labels')
const contactsRepository = require('../../contacts/repos')
const companyRepository = require('../../companies/repos')
const metadataRepository = require('../../../lib/metadata')
const adviserRepository = require('../../adviser/repos')
const interactionDataService = require('../services/data')
const interactionFormService = require('../services/form')
const { containsFormData } = require('../../../lib/controller-utils')
const { transformContactToOption } = require('../../transformers')

async function editDetails (req, res, next) {
  try {
    const token = req.session.token
    const default_dit_adviser = req.session.user

    // Work out what to use for the form data
    // This can either be data recently posted, to be re-rendered with errors
    // or an interaction that the user wishes to edit
    // or a new interaction for a company or contact
    if (containsFormData(req)) {
      res.locals.formData = req.body
      res.locals.company = await companyRepository.getDitCompany(token, req.body.company)
      res.locals.interaction_type = interactionDataService.getInteractionType(req.body.interaction_type)
    } else if (res.locals.interaction) {
      res.locals.formData = interactionFormService.getInteractionAsFormData(res.locals.interaction)
      res.locals.interaction_type = res.locals.interaction.interaction_type
      res.locals.company = res.locals.interaction.company
    } else if (req.query.company) {
      res.locals.interaction = await interactionDataService.createBlankInteractionForCompany(token, default_dit_adviser, req.query.interaction_type, req.query.company)
      res.locals.formData = interactionFormService.getInteractionAsFormData(res.locals.interaction)
      res.locals.company = res.locals.interaction.company
      res.locals.interaction_type = res.locals.interaction.interaction_type
    } else if (req.query.contact) {
      res.locals.interaction = await interactionDataService.createBlankInteractionForContact(token, default_dit_adviser, req.query.interaction_type, req.query.contact)
      res.locals.formData = interactionFormService.getInteractionAsFormData(res.locals.interaction)
      res.locals.company = res.locals.interaction.company
      res.locals.interaction_type = res.locals.interaction.interaction_type
    } else {
      return next('Unable to edit interaction')
    }

    if (req.query && req.query.company) {
      res.locals.backUrl = `/companies/${req.query.company}/interactions`
    } else if (req.query && req.query.contact) {
      res.locals.backUrl = `/contacts/${req.query.contact}/interactions`
    } else if (res.locals.interaction) {
      res.locals.backUrl = `/interactions/${res.locals.interaction.id}`
    }

    const companyContacts = await contactsRepository.getContactsForCompany(req.session.token, res.locals.formData.company)
    res.locals.contacts = companyContacts.map(transformContactToOption)

    if (res.locals.formData.dit_adviser) {
      res.locals.dit_adviser = await adviserRepository.getAdviser(req.session.token, res.locals.formData.dit_adviser)
    } else {
      res.locals.dit_adviser = default_dit_adviser
    }

    res.locals.serviceOptions = await metadataRepository.getServices(token)
    res.locals.serviceProviderOptions = metadataRepository.teams
    res.locals.labels = interactionLabels
    res
      .breadcrumb(`Add interaction for ${res.locals.company.name}`)
      .render('interactions/views/edit')
  } catch (error) {
    console.log(error)
    next(error)
  }
}

async function postDetails (req, res, next) {
  try {
    const result = await interactionFormService.saveInteractionForm(req.session.token, req.body)
    res.redirect(`/interactions/${result.id}`)
  } catch (errors) {
    if (errors.error) {
      if (errors.error.errors) {
        res.locals.errors = errors.error.errors
      } else {
        res.locals.errors = errors.error
      }
      editDetails(req, res, next)
    } else {
      next(errors)
    }
  }
}

module.exports = {
  editDetails,
  postDetails,
}
