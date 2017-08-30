const router = require('express').Router()

const { setHomeBreadcrumb } = require('../middleware')
const { getOrder } = require('./middleware/params')
const viewApp = require('./apps/view')
const editApp = require('./apps/edit')
const createApp = require('./apps/create')
const listApp = require('./apps/list')

router.param('orderId', getOrder)

router.use(createApp.mountpath, setHomeBreadcrumb(createApp.displayName), createApp.router)
router.use(editApp.mountpath, setHomeBreadcrumb(editApp.displayName), editApp.router)
router.use(viewApp.mountpath, setHomeBreadcrumb(viewApp.displayName), viewApp.router)
router.use(listApp.mountpath, listApp.router)

module.exports = router
