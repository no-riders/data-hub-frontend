const contactFormattingService = require('~/src/apps/contacts/services/formatting')

describe('Contact formatting service', function () {
  let contact
  let company

  beforeEach(function () {
    contact = {
      id: '12651151-2149-465e-871b-ac45bc568a62',
      created_on: '2017-02-14T14:49:17',
      modified_on: '2017-02-14T14:49:17',
      archived: false,
      archived_on: null,
      archived_reason: '',
      first_name: 'Fred',
      last_name: 'Smith',
      job_title: 'Director',
      primary: true,
      telephone_countrycode: '+44',
      telephone_number: '07814 333 777',
      email: 'fred@test.com',
      address_same_as_company: false,
      address_1: '10 The Street',
      address_2: 'Warble',
      address_town: 'Big Town',
      address_county: 'Large County',
      address_postcode: 'LL1 1LL',
      telephone_alternative: '07814 000 333',
      email_alternative: 'fred@gmail.com',
      notes: 'some notes',
      archived_by: null,
      title: {
        id: 'a26cb21e-6095-e211-a939-e4115bead28a',
        name: 'Mr',
      },
      adviser: null,
      address_country: null,
    }

    company = {
      id: '9876',
      'name': 'My Coorp',
    }
  })
  describe('contact details', function () {
    it('Should convert a typical contact into its display format', function () {
      const expected = {
        job_title: 'Director',
        telephone_number: '+44 7814 333 777',
        email: 'fred@test.com',
        address: '10 the Street, Warble, Big Town, Large County, LL1 1LL, United Kingdom',
        telephone_alternative: '07814 000 333',
        email_alternative: 'fred@gmail.com',
        notes: 'some notes',
      }

      const actual = contactFormattingService.getDisplayContact(contact, company)
      expect(actual).to.deep.equal(expected)
    })
  })
})
