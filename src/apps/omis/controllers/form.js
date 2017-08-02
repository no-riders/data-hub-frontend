const { get, last, mapValues } = require('lodash')
const { Controller } = require('hmpo-form-wizard')

class FormController extends Controller {
  getErrors (req, res) {
    const errors = super.getErrors(req, res)

    errors.messages = mapValues(errors, (item) => {
      return `${req.translate(`fields.${item.key}.label`)} ${item.message}`
    })

    return errors
  }

  errorHandler (err, req, res, next) {
    if (get(err, 'code') === 'MISSING_PREREQ') {
      const lastStep = last(req.journeyModel.get('history'))

      if (!lastStep) {
        return res.redirect(req.baseUrl)
      }
      return res.redirect(lastStep.path)
    }

    super.errorHandler(err, req, res, next)
  }
}

module.exports = FormController
