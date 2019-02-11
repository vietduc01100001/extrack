const router = require('express').Router();
const axios = require('../axios');
const { validateAddEditItem } = require('../validations');
const {
  handleItemListError,
  handleItemError,
  handleAddItemError,
  handleEditItemError,
  handleDeleteItemError,
} = require('../utils/error-handlers');
const {
  toString,
  toTitleCase,
  parseCostsToArray,
  getCache,
  deleteCache,
} = require('../utils');

const getItemList = async (req, res, next) => {
  const { category } = req.query;
  if (!category) return res.render('item-categories');
  try {
    const response = await axios.getInstance().get(`/items?category=${category}&sort=-purchaseCount`);
    if (response.status !== 200) return;
    const { items } = response.data;
    res.render('item-list', {
      items,
      category: toTitleCase(category),
      total: items.length,
    });
  } catch (err) {
    handleItemListError(err, res, next);
  }
};

const getItemAdd = (req, res) => {
  res.render('item-add-edit', {
    title: 'Adding new item',
    urlPath: 'add',
    actionText: 'Add',
    errorMessage: req.errorMessage,
  });
};

const getItemDetails = async (req, res, next) => {
  try {
    await getCache(`/items/${req.params.id}`, req);
    if (req.response.status !== 200) return;
    const { item } = req.response.data;
    res.render('item-details', {
      ...item,
      costsString: item.costs.join(', ')
    });
  } catch (err) {
    handleItemError(err, res, next);
  }
};

const getItemEdit = async (req, res, next) => {
  try {
    await getCache(`/items/${req.params.id}`, req);
    if (req.response.status !== 200) return;
    const { item } = req.response.data;
    res.render('item-add-edit', {
      ...item,
      costsString: item.costs.join(','),
      title: `Editing item ${item.name}`,
      urlPath: `${item._id}/edit`,
      actionText: 'Edit',
      errorMessage: req.errorMessage
    });
  } catch (err) {
    handleItemError(err, res, next);
  }
};

const getItemDelete = async (req, res, next) => {
  try {
    await getCache(`/items/${req.params.id}`, req);
    if (req.response.status !== 200) return;
    res.render('item-delete', req.response.data.item);
  } catch (err) {
    handleItemError(err, res, next);
  }
};

const addItem = async (req, res, next) => {
  const { isValid, errors } = validateAddEditItem(req.body);
  if (!isValid) {
    req.errorMessage = toString(errors);
    return next();
  }
  try {
    const requestBody = {
      name: req.body.name,
      category: req.body.category,
      costs: parseCostsToArray(req.body.costs)
    };
    const response = await axios.getInstance().post('/items', requestBody);
    if (response.status !== 201) return;
    const itemId = response.data.item._id;
    res.redirect(`/items/${itemId}`);
  } catch (err) {
    handleAddItemError(err, res, next);
  }
};

const editItem = async (req, res, next) => {
  const { isValid, errors } = validateAddEditItem(req.body);
  if (!isValid) {
    req.errorMessage = toString(errors);
    return next();
  }
  try {
    const requestBody = {
      name: req.body.name,
      category: req.body.category,
      costs: parseCostsToArray(req.body.costs)
    };
    const response = await axios.getInstance().patch(`/items/${req.params.id}`, requestBody);
    if (response.status !== 200) return;
    res.redirect(`/items/${req.params.id}`);
    deleteCache(`/items/${req.params.id}`);
  } catch (err) {
    handleEditItemError(err, res, next);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const response = await axios.getInstance().delete(`/items/${req.params.id}`);
    if (response.status !== 204) return;
    res.redirect('/items');
    deleteCache(`/items/${req.params.id}`);
  } catch (err) {
    handleDeleteItemError(err, res, next);
  }
};

router.get('/', getItemList);
router.get('/add', getItemAdd);
router.get('/:id', getItemDetails);
router.get('/:id/edit', getItemEdit);
router.get('/:id/delete', getItemDelete);
router.post('/add', addItem, getItemAdd);
router.post('/:id/edit', editItem, getItemEdit);
router.post('/:id/delete', deleteItem);

module.exports = router;
