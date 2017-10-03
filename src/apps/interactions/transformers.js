/* eslint-disable camelcase */
const { get, assign } = require('lodash')
const dateFns = require('date-fns')

const { transformDateObjectToDateString } = require('../transformers')

function transformInteractionResponseToForm ({
  interaction_type,
  company,
  subject,
  notes,
  contact,
  date,
  dit_adviser,
  service,
  dit_team,
}) {
  return {
    interaction_type: get(interaction_type, 'id'),
    company: get(company, 'id'),
    subject,
    notes,
    contact: get(contact, 'id'),
    date: {
      day: dateFns.format(date, 'DD'),
      month: dateFns.format(date, 'MM'),
      year: dateFns.format(date, 'YYYY'),
    },
    dit_adviser: get(dit_adviser, 'id'),
    service: get(service, 'id'),
    dit_team: get(dit_team, 'id'),
  }
}

function transformInteractionToListItem ({
  id,
  subject,
  kind,
  contact,
  company,
  date,
  dit_adviser,
}) {
  return {
    id,
    type: 'interaction',
    name: subject,
    meta: [
      {
        label: 'Type',
        type: 'badge',
        value: (kind === 'interaction') ? 'Interaction' : 'Service delivery',
      },
      {
        label: 'Contact',
        value: contact,
      },
      {
        label: 'Company',
        value: company,
      },
      {
        label: 'Date',
        value: date,
        type: 'date',
      },
      {
        label: 'Adviser',
        value: dit_adviser,
      },
    ],
  }
}

function transformInteractionResponsetoViewRecord ({
  company,
  interaction_type,
  subject,
  notes,
  date,
  dit_adviser,
  service,
  dit_team,
  contact,
}) {
  const contactLink = contact ? {
    url: `/contacts/${contact.id}`,
    name: contact.name,
  } : null

  const companyLink = company ? {
    url: `/companies/${company.id}`,
    name: company.name,
  } : null

  return {
    'Company': companyLink,
    'Type': interaction_type,
    'Subject': subject,
    'Notes': notes,
    'Date': {
      type: 'date',
      name: date,
    },
    'Adviser': dit_adviser,
    'Service': service,
    'Team': dit_team,
    'Contact': contactLink,
  }
}

function transformServiceDeliveryResponsetoViewRecord ({
  company,
  interaction_type,
  subject,
  notes,
  date,
  dit_adviser,
  service,
  dit_team,
  contact,
  event,
  status,
  uk_region,
  sector,
  country_of_interest,
}) {
  const contactLink = contact ? {
    url: `/contacts/${contact.id}`,
    name: contact.name,
  } : null

  const companyLink = company ? {
    url: `/companies/${company.id}`,
    name: company.name,
  } : null

  const eventLink = event ? {
    url: `/events/${event.id}`,
    name: event.subject,
  } : 'No'

  return {
    'Company': companyLink,
    'Contact': contactLink,
    'Service provider': dit_team,
    'Event': eventLink,
    'Service': service,
    'Subject': subject,
    'Notes': notes,
    'Date': {
      type: 'date',
      name: date,
    },
    'Adviser': dit_adviser,
  }
}

function transformInteractionFormBodyToApiRequest ({ props, company, communicationChannel }) {
  return assign({}, props, {
    date: transformDateObjectToDateString('date')(props),
    company: company,
    communication_channel: communicationChannel,
  })
}

module.exports = {
  transformInteractionResponseToForm,
  transformInteractionToListItem,
  transformInteractionFormBodyToApiRequest,
  transformInteractionResponsetoViewRecord,
  transformServiceDeliveryResponsetoViewRecord,
}
