const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

const Order = {
  save (token, data) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order`,
      method: 'POST',
      body: data,
    })
  },

  update (token, id, data) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order/${id}`,
      method: 'PATCH',
      body: data,
    })
  },

  saveSubscribers (token, id, body) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order/${id}/subscriber-list`,
      method: 'PUT',
      body,
    })
  },

  getAssignees (token, id) {
    return authorisedRequest(token, `${config.apiRoot}/v3/omis/order/${id}/assignee`)
  },

  saveAssignees (token, id, body) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order/${id}/assignee`,
      method: 'PATCH',
      body,
    })
  },

  forceSaveAssignees (token, id, body) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order/${id}/assignee?force-delete=1`,
      method: 'PATCH',
      body,
    })
  },

  getSubscribers (token, id) {
    return authorisedRequest(token, `${config.apiRoot}/v3/omis/order/${id}/subscriber-list`)
  },

  getById (token, id) {
    return authorisedRequest(token, `${config.apiRoot}/v3/omis/order/${id}`)
  },

  previewQuote (token, id) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order/${id}/quote/preview`,
      method: 'POST',
    })
  },

  getQuote (token, id) {
    return authorisedRequest(token, `${config.apiRoot}/v3/omis/order/${id}/quote`)
  },

  createQuote (token, id) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order/${id}/quote`,
      method: 'POST',
    })
  },

  cancelQuote (token, id) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order/${id}/quote/cancel`,
      method: 'POST',
    })
  },
}

module.exports = {
  Order,
}
