const errorCode404 = 404
const errorCode403 = 403
const errorCode500 = 500

describe('Error Middleware Test', () => {
  beforeEach(() => {
    this.winstonErrorStub = jest.fn()
    this.winstonInfoStub = jest.fn()
    this.nextSpy = jest.fn()
    this.responseRenderSpy = jest.fn()

    this.mockResponse = {
      status: () => {
        return {
          render: this.responseRenderSpy,
        }
      },
      locals: {
        BREADCRUMBS: [],
      },
      headersSent: false,
    }
    this.responseStatusCodeSpy = jest.spyOn(this.mockResponse, 'status')

    jest.mock('../../../config', () => ({ isDev: true }))
    jest.mock('../../../config/logger', () => ({
      info: this.winstonInfoStub,
      error: this.winstonErrorStub,
    }))

    this.middleware = require('../errors')
  })

  describe('#notFound', () => {
    test('should log a 404 and drop through to next middleware', () => {
      const mockResponse = {
        locals: {
          BREADCRUMBS: [],
        },
      }

      this.middleware.notFound(null, mockResponse, this.nextSpy)

      expect(this.nextSpy).toHaveBeenCalledTimes(1)
      expect(this.nextSpy).toHaveBeenCalledWith(Error('Not Found'))
      expect(this.nextSpy.mock.calls[0][0].statusCode).toBe(404)
      expect(mockResponse.locals.BREADCRUMBS).toBeNull()
    })
  })

  describe('#catchAll', () => {
    test('should log a 404 and render response', () => {
      const error = new Error(`mock ${errorCode404} error`)
      error.statusCode = errorCode404

      this.middleware.catchAll(error, null, this.mockResponse, this.nextSpy)

      expect(this.responseStatusCodeSpy).toHaveBeenCalledTimes(1)
      expect(this.responseStatusCodeSpy).toHaveBeenCalledWith(errorCode404)

      expect(this.responseRenderSpy).toHaveBeenCalledTimes(1)
      expect(this.responseRenderSpy).toBeCalledWith('errors', {
        'devErrorDetail': error,
        'statusCode': errorCode404,
        'statusMessage': 'Sorry we couldn\'t find that page!',
      })
      expect(this.winstonInfoStub).toHaveBeenCalledWith(error)
    })

    test('should log a 500 and render response', () => {
      const error = new Error(`mock ${errorCode500} error`)

      this.middleware.catchAll(error, null, this.mockResponse, this.nextSpy)

      expect(this.responseStatusCodeSpy).toHaveBeenCalledTimes(1)
      expect(this.responseStatusCodeSpy).toHaveBeenCalledWith(errorCode500)
      expect(this.responseRenderSpy).toHaveBeenCalledTimes(1)
      expect(this.responseRenderSpy).toBeCalledWith('errors', {
        'devErrorDetail': error,
        'statusCode': errorCode500,
        'statusMessage': 'Sorry something has gone wrong!',
      })
      expect(this.winstonErrorStub).toHaveBeenCalledWith(error)
    })

    test('should log a 403 and render response', () => {
      const error = new Error(`mock ${errorCode403} error`)

      error.statusCode = errorCode403
      error.code = 'EBADCSRFTOKEN'

      this.middleware.catchAll(error, null, this.mockResponse, this.nextSpy)

      expect(this.responseStatusCodeSpy).toHaveBeenCalledTimes(1)
      expect(this.responseStatusCodeSpy.mock.calls[0][0]).toBe(errorCode403)
      expect(this.responseRenderSpy).toHaveBeenCalledTimes(1)
      expect(this.responseRenderSpy).toBeCalledWith('errors', {
        'devErrorDetail': error,
        'statusCode': errorCode403,
        'statusMessage': 'This form has been tampered with',
      })
      expect(this.winstonErrorStub).toHaveBeenCalledWith(error)
      expect(this.nextSpy).not.toBeCalled()
    })

    test('should log a 500 and render response without error information', () => {
      const error = new Error(`mock ${errorCode500} error`)

      jest.resetModules()
      jest.mock('../../../config', () => ({ isDev: false }))
      this.middleware = require('../errors')
      this.middleware.catchAll(error, null, this.mockResponse, this.nextSpy)

      expect(this.responseStatusCodeSpy).toHaveBeenCalledTimes(1)
      expect(this.responseStatusCodeSpy.mock.calls[0][0]).toBe(errorCode500)
      expect(this.responseRenderSpy).toHaveBeenCalledTimes(1)
      expect(this.responseRenderSpy).toBeCalledWith('errors', {
        'devErrorDetail': false,
        'statusCode': errorCode500,
        'statusMessage': 'Sorry something has gone wrong!',
      })
      expect(this.winstonErrorStub).toHaveBeenCalledWith(error)
    })

    test('should drop through to next middleware as headers have already been sent', () => {
      const mockResponse = { headersSent: true }
      const error = new Error('mock headers sent error')

      this.middleware.catchAll(error, null, mockResponse, this.nextSpy)

      expect(this.nextSpy).toHaveBeenCalledWith(error)
    })
  })
})
