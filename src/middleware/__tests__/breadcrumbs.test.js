const breadcrumbs = require('../breadcrumbs')

describe('breadcrumbs middleware', () => {
  beforeEach(() => {
    this.nextSpy = jest.fn()
    this.resMock = {}
  })

  describe('#init', () => {
    beforeEach(() => {
      this.init = breadcrumbs.init()
    })

    test('should attach a method to the response object', () => {
      this.init({}, this.resMock, this.nextSpy)

      expect(this.resMock).toHaveProperty('breadcrumb')
      expect(typeof this.resMock.breadcrumb).toBe('function')
      expect(this.nextSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('#res.breadcrumb', () => {
    beforeEach(() => {
      this.init = breadcrumbs.init()
      this.init({}, this.resMock, this.nextSpy)
    })

    describe('when called with no arguments', () => {
      test('should return the breadcrumb', () => {
        expect(this.resMock.breadcrumb()).toEqual([])
      })
    })

    describe('when called with 1 argument', () => {
      test('should set name', () => {
        this.resMock.breadcrumb('Name')

        expect(this.resMock.breadcrumb()).toEqual([{
          name: 'Name',
        }])
      })
    })

    describe('when called with 2 arguments', () => {
      test('should set url and name', () => {
        this.resMock.breadcrumb('Name', '/sample-url')

        expect(this.resMock.breadcrumb()).toEqual([{
          name: 'Name',
          url: '/sample-url',
        }])
      })
    })

    describe('when called with an object', () => {
      test('should add the object to breadcrumb', () => {
        this.resMock.breadcrumb({
          name: 'Name',
          url: '/sample-url',
        })

        expect(this.resMock.breadcrumb()).toEqual([{
          name: 'Name',
          url: '/sample-url',
        }])
      })
    })

    describe('when called with an array of objects', () => {
      test('should add each object to breadcrumb', () => {
        this.resMock.breadcrumb([{
          name: 'First item',
          url: '/first-item',
        },
        {
          name: 'Second item',
          url: '/second-item',
        }])

        expect(this.resMock.breadcrumb()).toEqual([{
          name: 'First item',
          url: '/first-item',
        },
        {
          name: 'Second item',
          url: '/second-item',
        }])
      })
    })
  })

  describe('#setHome', () => {
    beforeEach(() => {
      this.init = breadcrumbs.init()
      this.init({}, this.resMock, jest.fn())

      this.setHome = breadcrumbs.setHome
    })

    describe('when called with no arguments', () => {
      test('should set a default value for the home item', () => {
        this.setHome()({}, this.resMock, this.nextSpy)

        expect(this.nextSpy).toHaveBeenCalledTimes(1)
        expect(this.resMock.breadcrumb()).toEqual([{
          name: 'Home',
          url: '/',
          _home: true,
        }])
      })
    })

    describe('when called with an object', () => {
      beforeEach(() => {
        this.setHome({
          name: 'Root',
          url: '/root',
        })({}, this.resMock, this.nextSpy)
      })

      test('should set the object as the home item', () => {
        expect(this.nextSpy).toBeCalled()
        expect(this.resMock.breadcrumb()).toEqual([{
          name: 'Root',
          url: '/root',
          _home: true,
        }])
      })
    })

    describe('when home is already set', () => {
      beforeEach(() => {
        this.setHome()({}, this.resMock, this.nextSpy)
      })

      test('should update the home item', () => {
        this.setHome({
          name: 'Root',
          url: '/root',
        })({}, this.resMock, this.nextSpy)

        expect(this.nextSpy).toHaveBeenCalledTimes(2)
        expect(this.resMock.breadcrumb()).toEqual([{
          name: 'Root',
          url: '/root',
          _home: true,
        }])
      })
    })
  })
})
