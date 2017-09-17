describe('title middleware', () => {
  beforeEach(() => {
    this.title = require('../title')()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('set title', () => {
    test('should set title to the string passed', () => {
      const nextSpy = jest.fn()
      const resMock = { locals: {} }
      const testTitle = 'Test title'

      this.title({}, resMock, nextSpy)

      expect(resMock).toHaveProperty('title')
      expect(typeof resMock.title).toBe('function')

      resMock.title(testTitle)

      expect(resMock.locals.title).toBe(testTitle)
      expect(nextSpy).toHaveBeenCalledTimes(1)
    })
  })
})
