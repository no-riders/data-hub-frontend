const resMock = {}

describe('Auth middleware', () => {
  beforeEach(() => {
    this.authMiddleware = require('../auth')
    this.nextSpy = jest.fn()
  })

  describe('authenticated/allowed requests', () => {
    test('should call the next middleware when request contains an allowed url', () => {
      const reqMock = {
        url: '/sign-in',
      }

      this.authMiddleware(reqMock, resMock, this.nextSpy)

      expect(this.nextSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('when session token is set', () => {
    test('should call the next middleware', () => {
      const reqMock = {
        url: '',
        session: {
          token: 'abcd',
        },
      }

      this.authMiddleware(reqMock, resMock, this.nextSpy)

      expect(this.nextSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('unauthenticated requests', () => {
    test('should set the requested url on the session and redirect', () => {
      const reqMock = {
        url: '/protected-url',
        originalUrl: '/protected-url',
        session: {},
      }
      const resMock = {
        redirect: jest.fn(),
      }

      this.authMiddleware(reqMock, resMock, this.nextSpy)

      expect(reqMock.session).toHaveProperty('returnTo')
      expect(reqMock.session.returnTo).toBe('/protected-url')
      expect(this.nextSpy).not.toHaveBeenCalled()
      expect(resMock.redirect).toHaveBeenCalledWith('/sign-in')
    })
  })
})
