const EditAssigneesController = require('./assignees')
const EditAssigneeTimeController = require('./assignee-time')
const EditClientDetailsController = require('./client-details')
const EditSubscribersController = require('./subscribers')
const EditWorkDescriptionController = require('./work-description')
const editHandler = require('./edit-handler')
const editLeadAssignee = require('./edit-lead-assignee')
const editRedirect = require('./edit-redirect')

module.exports = {
  EditAssigneesController,
  EditAssigneeTimeController,
  EditClientDetailsController,
  EditSubscribersController,
  EditWorkDescriptionController,
  editHandler,
  editLeadAssignee,
  editRedirect,
}
