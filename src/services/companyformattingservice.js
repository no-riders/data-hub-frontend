const { companyDetailsLabels, chDetailsLabels, hqLabels } = require('../labels/companylabels')
const getFormattedAddress = require('../lib/address').getFormattedAddress
const sentenceCase = require('../lib/sentencecase')
const DateLib = require('../lib/date')
const { getPrimarySectorName } = require('../lib/transformsectors')

const companyDetailsDisplayOrder = Object.keys(companyDetailsLabels)
const chDetailsDisplayOrder = Object.keys(chDetailsLabels)
const companyTableKeys = ['name', 'address']

function getDisplayCH (company) {
  if (!company.companies_house_data) return null

  const companyHouseData = company.companies_house_data

  const displayCH = {
    name: sentenceCase(companyHouseData.name),
    company_number: companyHouseData.company_number,
    business_type: companyHouseData.company_category,
    company_status: companyHouseData.company_status,
    registered_address: getFormattedAddress(companyHouseData, 'registered'),
    incorporation_date: DateLib.formatDate(companyHouseData.incorporation_date)
  }

  displayCH.sic_code = []
  if (companyHouseData.sic_code_1 && companyHouseData.sic_code_1.length > 0) displayCH.sic_code.push(companyHouseData.sic_code_1)
  if (companyHouseData.sic_code_2 && companyHouseData.sic_code_1.length > 0) displayCH.sic_code.push(companyHouseData.sic_code_2)
  if (companyHouseData.sic_code_3 && companyHouseData.sic_code_1.length > 0) displayCH.sic_code.push(companyHouseData.sic_code_3)
  if (companyHouseData.sic_code_4 && companyHouseData.sic_code_1.length > 0) displayCH.sic_code.push(companyHouseData.sic_code_4)

  return displayCH
}

function getDisplayCompany (company) {
  if (!company.id) return null

  const displayCompany = {
    sector: (company.sector && company.sector.name) ? getPrimarySectorName(company.sector.name) : null,
    description: company.description || null,
    website: company.website ? `<a href="${company.website}">${company.website}</a>` : null,
    employee_range: (company.employee_range && company.employee_range.name) ? company.employee_range.name : null,
    turnover_range: (company.turnover_range && company.turnover_range.name) ? company.turnover_range.name : null,
    account_manager: (company.account_manager && company.account_manager.name) ? company.account_manager.name : null,
    headquarter_type: (company.headquarter_type && company.headquarter_type.name && company.headquarter_type.name.length > 0) ? hqLabels[company.headquarter_type.name] : 'Not a headquarters',
    alias: company.alias || null
  }

  if (company.alias && company.alias.length > 0) displayCompany.alias = company.alias

  const registeredAddress = getFormattedAddress(company, 'registered')
  if (registeredAddress.length > 0) displayCompany.registered_address = registeredAddress
  if (company.registered_address_country && company.registered_address_country.name) {
    displayCompany.country = company.registered_address_country.name
  }
  const tradingAddress = getFormattedAddress(company, 'trading')
  if (tradingAddress.length > 0) displayCompany.trading_address = tradingAddress

  if (!company.companies_house_data) {
    displayCompany.business_type = (company.business_type && company.business_type.name && company.business_type.name !== 'Undefined') ? company.business_type.name : null
    displayCompany.name = company.name
  }

  if (company.uk_region && company.uk_region.name && company.uk_region.name !== 'Undefined') displayCompany.uk_region = company.uk_region.name

  return displayCompany
}

function getHeadingAddress (company) {
  // If this is a CDMS company
  const cdmsTradingAddress = getFormattedAddress(company, 'trading')
  if (cdmsTradingAddress.length > 0) {
    return cdmsTradingAddress
  }

  if (company.companies_house_data && company.companies_house_data !== null) {
    return getFormattedAddress(company.companies_house_data, 'registered')
  }

  return getFormattedAddress(company, 'registered')
}

function getHeadingName (company) {
  if (company.id) {
    if (company.alias && company.alias.length > 0) {
      return company.alias
    }
    return company.name
  } else {
    return company.companies_house_data.name
  }
}

function parseRelatedData (companies) {
  if (!companies) return null

  return companies.map((company) => {
    const key = (company.trading_address_1 && company.trading_address_1.length > 0) ? 'trading' : 'registered'

    let address = ''
    if (company[`${key}_address_town`] && company[`${key}_address_town`].length > 0) {
      address += sentenceCase(`${company[`${key}_address_town`]}, `)
    } else if (company[`${key}_address_county`] && company[`${key}_address_county`].length > 0) {
      address += sentenceCase(`${company[`${key}_address_county`]}, `)
    }
    if (company[`${key}_address_country`] && company[`${key}_address_country`].name && company[`${key}_address_country`].name.length > 0) {
      address += sentenceCase(company[`${key}_address_country`].name)
    } else if (address.length > 0) {
      address += 'United Kingdom'
    }
    return {
      name: `<a href="/company/company_company/${company.id}">${company.alias || company.name}</a>`,
      address
    }
  })
}

module.exports = {
  companyDetailsDisplayOrder,
  chDetailsDisplayOrder,
  getDisplayCH,
  getDisplayCompany,
  getHeadingAddress,
  getHeadingName,
  parseRelatedData,
  companyTableKeys
}