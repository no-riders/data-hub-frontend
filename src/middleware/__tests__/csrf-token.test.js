describe('CRSF token', () => {
  beforeEach(() => {
    this.csrfMiddleware = require('../csrf-token')()
  })

  describe('set a CSRF token', () => {
    test('should set the csrf token on response locals object', () => {
      const csrfSpy = jest.fn()
      const nextSpy = jest.fn()
      const reqMock = { csrfToken: csrfSpy }
      const resMock = { locals: {} }

      this.csrfMiddleware(reqMock, resMock, nextSpy)

      expect(resMock.locals).toHaveProperty('csrfToken')
      expect(csrfSpy).toHaveBeenCalledTimes(1)
      expect(nextSpy).toHaveBeenCalledTimes(1)
    })
  })
})
