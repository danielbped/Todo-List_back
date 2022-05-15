const { StatusCodes } = require('http-status-codes');
const { Task } = require('../models');
const ErrorMessages = require('../utils/ErrorMessages');

const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const task = { title, content, created: new Date(), updated: new Date() };

    const { id } = await Task.create(task);

    res.status(StatusCodes.CREATED).json({ id, ...task })
  } catch (err) {
    next(err)
  }
};

const getAll = async (_req, res, next) => {
  try {
    const tasks = await Task.findAll();

    res.status(StatusCodes.OK).json(tasks)
  } catch (err) {
    next(err)
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id }
    });

    if (!task) {
      res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.taskNotFound })
    }

    await Task.destroy({
      where: { id }
    });

    res.status(StatusCodes.OK).end();
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const task = await Task.findOne({
      where: { id }
    });

    if (!task) {
      res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.taskNotFound })
    }

    const updatedTask = { title, content, updated: new Date() }

    await Task.update(
      { ...updatedTask }, 
      { where: { id } }
    )

    res.status(StatusCodes.OK).json({
      updatedTask
    })
  } catch (err) {
    next(err)
  }
};

module.exports = {
  create,
  getAll,
  remove,
  update
}