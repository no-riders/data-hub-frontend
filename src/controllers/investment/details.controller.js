const router = require('express').Router()
const { get } = require('lodash')

const { getProjectDetails } = require('./shared.middleware')
const { detailsLabels, valueLabels } = require('./labels')
const { getDataLabels } = require('../../lib/controller-utils')
const { transformProjectDataForView } = require('../../services/investment-formatting.service')

function detailsGetHandler (req, res, next) {
  if (get(res, 'locals.projectData')) {
    const transformedDetails = transformProjectDataForView(res.locals.projectData, detailsLabels.view)

    return res.render('investment/details', {
      details: getDataLabels(transformedDetails, detailsLabels.view),
      values: getDataLabels(res.locals.valueData, valueLabels.view),
      currentNavItem: 'details',
    })
  }
  return next()
}

function redirectToDetails (req, res) {
  res.redirect(`/investment/${req.params.id}/details`)
}

router.param('id', getProjectDetails)
router.get('/:id', redirectToDetails)
router.get('/:id/details', detailsGetHandler)

module.exports = {
  router,
  redirectToDetails,
  detailsGetHandler,
}
