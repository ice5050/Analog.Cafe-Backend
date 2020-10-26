const express = require('express')
const emailApp = express()

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

  if (!isValidEmail(email)) return res.json({ status: 'error' })
  if (!LIST_IDS_BY_GROUP_NAME[list_group][0])
    return res.json({ status: 'error' })

  // submit to Sendgrid api
  const status = await removeOneFromListSendgrid(email, list_group)

  return res.json({ status })
})

emailApp.post(
  '/emails/list-subscriptions',
  authenticationMiddleware,
  async (req, res) => {
    const email = req.body.email
    const list_group = req.body.list || 'undefined'

    if (!isValidEmail(email)) return res.json({ status: 'error' })
    if (!LIST_IDS_BY_GROUP_NAME[list_group][0])
      return res.json({ status: 'error' })

    // submit to Sendgrid api
    const status = await removeOneFromListSendgrid(email, list_group)

    return res.json({ status })
  }
)

module.exports = emailApp
