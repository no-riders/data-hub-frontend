/* eslint handle-callback-err: 0, camelcase: 0 */

describe('interaction form service', function () {
  let saveInteractionStub
  let company
  let contact
  let dit_adviser
  let interaction_type
  let interaction
  let service
  let dit_team
  let interactionFormService

  beforeEach(function () {
    company = { id: '1234', name: 'Fred ltd' }
    contact = { id: '3321', name: 'Fred Smith', first_name: 'Fred', last_name: 'Smith', company }
    dit_adviser = { id: '4455', name: 'Fred Jones', first_name: 'Fred', last_name: 'Jones' }
    interaction_type = { id: '1234', name: 'Email' }
    service = { id: '6654', name: 'Significant Assist' }
    dit_team = { id: '90934', name: 'North East' }
    interaction = {
      id: '999',
      company,
      contact,
      interaction_type,
      subject: 'Test subject',
      notes: 'Test notes',
      date: '2017-01-02:T00:00:00.00Z',
      dit_adviser,
      service,
      dit_team,
    }

    saveInteractionStub = sinon.stub().resolves({
      id: '1234',
      subject: 'subject',
      company: company.id,
      contact: contact.id,
    })

    interactionFormService = proxyquire('~/src/apps/interactions/services/form', {
      '../repos': {
        saveInteraction: saveInteractionStub,
      },
    })
  })

  describe('Convert API to Form', function () {
    it('should an existing API format interaction entity into a format for use with a HTML form', function () {
      const expected = {
        id: '999',
        company: company.id,
        contact: contact.id,
        interaction_type: interaction_type.id,
        subject: 'Test subject',
        notes: 'Test notes',
        date: '2017-01-02:T00:00:00.00Z',
        dit_adviser: dit_adviser.id,
        service: service.id,
        dit_team: dit_team.id,
      }
      expect(interactionFormService.getInteractionAsFormData(interaction)).to.deep.equal(expected)
    })
    it('should handle new blank interactions being editing for the first time', function () {
      const freshInteraction = {
        company,
        contact: null,
        interaction_type: interaction_type,
        dit_adviser,
        date: '2017-01-02:T00:00:00.00Z',
        service: {
          id: null,
          name: null,
        },
        dit_team: {
          id: null,
          name: null,
        },
      }
      const expected = {
        id: null,
        company: company.id,
        contact: null,
        interaction_type: interaction_type.id,
        subject: null,
        notes: null,
        date: '2017-01-02:T00:00:00.00Z',
        dit_adviser: dit_adviser.id,
        service: null,
        dit_team: null,
      }
      expect(interactionFormService.getInteractionAsFormData(freshInteraction)).to.deep.equal(expected)
    })
  })
})
