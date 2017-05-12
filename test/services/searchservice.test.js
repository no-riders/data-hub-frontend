/* globals expect: true, describe: true, it: true */
const nock = require('nock')
const config = require('../../src/config')
const searchService = require('../../src/services/searchservice')
const companyMockAPIResponse = require('../data/search-response-company')
const companiesHousePrivateLtdMockAPIResponse = require('../data/search-response-companies-house-private-ltd')
const companiesHousePublicLtdMockAPIResponse = require('../data/search-response-companies-house-public-ltd')

const facets = {
  'facets': {
    'Category': [
      {
        'name': 'doc_type',
        'value': 'company',
        'label': 'Company',
        'checked': undefined
      },
      {
        'name': 'doc_type',
        'value': 'company_contact',
        'label': 'Contact',
        'checked': undefined
      }
    ]
  }
}

describe('Search service', function () {
  describe('searchService.search method', function () {
    it('Should return expected format from search method for a company', function () {
      const expectedResponse = Object.assign(companyMockAPIResponse, facets)

      nock(config.apiRoot)
        .post('/search/')
        .reply(200, companyMockAPIResponse)

      searchService.search({
        token: 'token',
        term: 'testTerm',
        filters: ['company_company', 'company_companieshousecompany']
      })
        .then((response) => {
          expect(response).to.deep.equal(expectedResponse)
        })
    })

    it('Should return expected format from search method for a companies house private ltd', function () {
      const expectedResponse = Object.assign(companiesHousePrivateLtdMockAPIResponse, facets)

      nock(config.apiRoot)
        .post('/search/')
        .reply(200, companiesHousePrivateLtdMockAPIResponse)

      searchService.search({
        token: 'token',
        term: 'testTerm',
        filters: ['company_company', 'company_companieshousecompany']
      })
        .then((response) => {
          expect(response).to.deep.equal(expectedResponse)
        })
    })

    it('Should return expected format from search method for a companies house public ltd', function () {
      const expectedResponse = Object.assign(companiesHousePublicLtdMockAPIResponse, facets)

      nock(config.apiRoot)
        .post('/search/')
        .reply(200, companiesHousePublicLtdMockAPIResponse)

      searchService.search({
        token: 'token',
        term: 'testTerm',
        filters: ['company_company', 'company_companieshousecompany']
      })
        .then((response) => {
          expect(response).to.deep.equal(expectedResponse)
        })
    })
  })
})