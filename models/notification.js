const mongoose = require('mongoose')
const { Schema, model } = mongoose


const newInvoiceNotificationSchema = new Schema({
  recipient: {
    type: String,
    ref: "Student",
    required: true
  },
  type: {
    type: String,
    default: 'NEW_INVOICE'
  },
  invoiceID: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
})

const newInvoiceNotificationModel = model(
  "NewInvoiceNotification",
  newInvoiceNotificationSchema,
  "notifications"
)

const newMessageNotificationSchema = new Schema({
  recipient: {
    type: String,
    ref: "Student",
    required: true
  },
  type: {
    type: String,
    default: 'NEW_MESSAGE'
  }
})

const newMessageNotificationModel = model(
  "NewMessageNotification",
  newMessageNotificationSchema,
  "notifications"
)

const notificationModel = model('Notification', {}, 'notifications')


module.exports = function (type) {
  switch (type) {
    case "NEW_INVOICE":
      return newInvoiceNotificationModel;
    case "NEW_MESSAGE":
      return newMessageNotificationModel;
    default:
      return notificationModel;
  }
}