const { StatusCodes } = require('http-status-codes')
const { Task } = require('../models')
const ErrorMessages = require('../utils/ErrorMessages')
const isAuthenticated = require('../middlewares/User/isAuthenticated')
const { User } = require('../models')

const create = async (req, res, next) => {
  try {
    const { title, content } = req.body

    const { data } = isAuthenticated(req, res);

    if (data) {
      const user = await User.findOne({ where: { email: data.email } })
  
      const task = { title, content, created: new Date(), updated: new Date(), status: 'UNDONE', owner: user.id }
      const { id } = await Task.create(task)
  
      return res.status(StatusCodes.CREATED).json({ id, ...task })
    }
  } catch (err) {
    next(err)
  }
}

const getAll = async (_req, res, next) => {
  try {
    const tasks = await Task.findAll()

    return res.status(StatusCodes.OK).json({ tasks })
  } catch (err) {
    next(err)
  }
}

const findById = async (req, res, next) => {
  try {
    const { id } = req.params

    const task = await Task.findOne({
      where: { id }
    })

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND)
        .json({ message: ErrorMessages.taskNotFound })
    }

    return res.status(StatusCodes.OK).json({ task })
  } catch (err) {
    next(err)
  }
}

const findByOwnerId = async (req, res, next) => {
  try {
    const { id } = req.params

    const task = await Task.findOne({ where: { owner: id } })

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND)
        .json({ message: ErrorMessages.taskNotFound })
    }

    return res.status(StatusCodes.OK).json({ task })
  } catch (err) {
    next(err)
  }
}

const remove = async (req, res, next) => {
  try {
    const { id } = req.params

    const task = await Task.findOne({
      where: { id }
    })

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.taskNotFound })
    }

    await Task.destroy({
      where: { id }
    })

    return res.status(StatusCodes.OK).end()
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, content, status } = req.body

    const task = await Task.findOne({
      where: { id }
    })

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.taskNotFound })
    }

    const updatedTask = { title, content, updated: new Date(), status }

    await Task.update(
      { ...updatedTask }, 
      { where: { id } }
    )

    return res.status(StatusCodes.OK).json({ updatedTask })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  create,
  getAll,
  findById,
  remove,
  update,
  findByOwnerId
}