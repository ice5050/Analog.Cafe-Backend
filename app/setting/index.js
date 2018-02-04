const express = require('express')
const Setting = require('../../models/mongo/setting')
const {
  authenticationMiddleware,
  filterRoleMiddleware
} = require('../../helpers/authenticate')
const settingApp = express()

/**
 * @swagger
 * /settings:
 *   get:
 *     description: Get server configuration
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *     responses:
 *       200:
 *         description: Return image information.
 *       401:
 *         description: No permission to access.
 */
settingApp.get(
  '/settings',
  authenticationMiddleware,
  filterRoleMiddleware('admin'),
  async (req, res) => {
    const setting = await Setting.findOne()
    res.json(setting.toObject())
  }
)

module.exports = settingApp
