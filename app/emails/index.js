const express = require('express')
const emailApp = express()
const { authenticationMiddleware } = require('../../helpers/authenticate')
const User = require('../../models/mongo/user')
const {
  findSendgridContactByEmail,
  upsertOneSendgrid
} = require('../../helpers/email_list_manager')

const {
  removeOneFromListSendgrid,
  LIST_IDS_BY_GROUP_NAME
} = require('../../helpers/email_list_manager')

const isValidEmail = email => {
  const rule = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
  return rule.test(email)
}

emailApp.post('/emails/unsubscribe', async (req, res) => {
  const email = req.body.email
  const list_group = req.body.list || 'undefined'

  if (!isValidEmail(email)) return res.status(404).json({ status: 'error' })
  if (!LIST_IDS_BY_GROUP_NAME[list_group][0])
    return res.status(400).json({ status: 'error' })

  // submit to Sendgrid api
  const status = await removeOneFromListSendgrid(email, list_group)

  return res.json({ status })
})

emailApp.post(
  '/emails/unsubscribe-user',
  authenticationMiddleware,
  async (req, res) => {
    const email = req.user.email
    const list_group = req.body.list || 'undefined'

    if (!LIST_IDS_BY_GROUP_NAME[list_group][0])
      return res.status(400).json({ status: 'error' })

    // submit to Sendgrid api
    const status = await removeOneFromListSendgrid(email, list_group)

    return res.json({ status })
  }
)

emailApp.post(
  '/emails/subscribe-user',
  authenticationMiddleware,
  async (req, res) => {
    const email = req.user.email
    const list_group = req.body.list || 'undefined'

    if (!LIST_IDS_BY_GROUP_NAME[list_group][0])
      return res.status(400).json({ status: 'error' })

    // first we need to find contact id
    const contact = await findSendgridContactByEmail(email)

    // couldn't find email in sendgrid
    if (!contact || !contact.id)
      return res.status(404).json({ status: 'error' })

    // submit to Sendgrid api
    const status = await upsertOneSendgrid(
      {
        id: contact.id,
        email: contact.email
      },
      list_group
    )

    return res.json({ status })
  }
)

emailApp.get(
  '/emails/list-subscriptions',
  authenticationMiddleware,
  async (req, res) => {
    const email = req.user.email
    const contact = await findSendgridContactByEmail(email)
    if (contact.error) return res.json({ error: contact.error })

    const reverseLookup = {}
    Object.keys(LIST_IDS_BY_GROUP_NAME).forEach(key => {
      reverseLookup[LIST_IDS_BY_GROUP_NAME[key][0]] = key
    })
    const sendgrid = contact.list_ids.map(id => {
      return reverseLookup[id]
    })

    return res.json({ sendgrid })
  }
)

module.exports = emailApp
