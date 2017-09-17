describe('Store middleware', () => {
  beforeEach(() => {
    this.storeMiddleware = require('../store')()
    this.nextSpy = jest.fn()
    this.reqMock = {
      session: {},
    }
  })

  describe('store middleware sets up correctly', () => {
    test('req should have expected store methods', () => {
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      expect(typeof this.reqMock.store).toBe('function')
      expect(typeof this.reqMock.store.get).toBe('function')
      expect(typeof this.reqMock.store.remove).toBe('function')
      expect(typeof this.reqMock.session.store).toBe('object')
    })

    test('call the next middleware', () => {
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      expect(this.nextSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('when store middleware is set up', () => {
    test('data should be stored in session.store correctly', () => {
      const mockDataArray = ['data']
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      this.reqMock.store('example_key', mockDataArray)

      expect(this.nextSpy).toHaveBeenCalledTimes(1)
      expect(this.reqMock.session.store).toEqual({ 'example_key': mockDataArray })
    })

    test('#get should get stored data', () => {
      const mockData = 'data'
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      this.reqMock.store('example_key', mockData)
      const storeData = this.reqMock.store.get('example_key')

      expect(this.nextSpy).toHaveBeenCalledTimes(1)
      expect(this.reqMock.session.store).toEqual({ 'example_key': mockData })
      expect(storeData).toBe(mockData)
    })

    test('#remove should get stored data', () => {
      const mockDataObj = { value: 'data' }
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      this.reqMock.store('example_key', mockDataObj)

      expect(this.nextSpy).toHaveBeenCalledTimes(1)
      expect(this.reqMock.session.store).toEqual({ 'example_key': mockDataObj })

      this.reqMock.store.remove('example_key')
      expect(this.reqMock.session.store).toEqual({})
    })
  })
})
