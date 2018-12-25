const router = require('express').Router();
const axios = require('../../axios');
const {
  validateAddEditItem,
  validatePurchaseItem,
} = require('../../validations');
const {
  handleItemListError,
  handleItemError,
  handleAddItemError,
  handlePurchaseItemError,
  handleEditItemError,
  handleDeleteItemError,
} = require('./error-handlers');
const { toString } = require('../../utils');
const { parseCostsToArray } = require('./utils');

const getItemList = async (req, res, next) => {
  try {
    const response = await axios.getInstance().get('/items?sort=-purchaseCount');
    if (response.status !== 200) return;
    const { items } = response.data;
    res.render('item-list', {
      items,
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
    const response = await axios.getInstance().get(`/items/${req.params.id}`);
    if (response.status !== 200) return;
    const { item } = response.data;
    res.render('item-details', {
      ...item,
      costsString: item.costs.join(', ')
    });
  } catch (err) {
    handleItemError(err, res, next);
  }
};

const getItemPurchase = async (req, res, next) => {
  try {
    const response = await axios.getInstance().get(`/items/${req.params.id}`);
    if (response.status !== 200) return;
    res.render('item-purchase', {
      ...response.data.item,
      errorMessage: req.errorMessage
    });
  } catch (err) {
    handleItemError(err, res, next);
  }
};

const getItemEdit = async (req, res, next) => {
  try {
    const response = await axios.getInstance().get(`/items/${req.params.id}`);
    if (response.status !== 200) return;
    const { item } = response.data;
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
    const response = await axios.getInstance().get(`/items/${req.params.id}`);
    if (response.status !== 200) return;
    res.render('item-delete', response.data.item);
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
    res.redirect(`/spending-assistant/items/${itemId}`);
  } catch (err) {
    handleAddItemError(err, res, next);
  }
};

const purchaseItem = async (req, res, next) => {
  const { isValid, errors } = validatePurchaseItem(req.body);
  if (!isValid) {
    req.errorMessage = toString(errors);
    return next();
  }
  try {
    const itemsRes = await axios.getInstance().get(`/items/${req.params.id}`);
    if (itemsRes.status === 200) {
      const requestBody = {
        items: [{
          _id: req.params.id,
          name: itemsRes.data.item.name,
          cost: parseInt(req.body.cost),
          quantity: parseInt(req.body.quantity)
        }],
        purchaseDate: new Date(),
        description: req.body.description
      };
      const purchasesRes = await axios.getInstance().post('/purchases', requestBody);
      if (purchasesRes.status !== 201) return;
      const purchaseId = purchasesRes.data.purchase._id;
      res.redirect(`/spending-assistant/purchases/${purchaseId}`);
    }
  } catch (err) {
    handlePurchaseItemError(err, res, next);
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
    res.redirect(`/spending-assistant/items/${req.params.id}`);
  } catch (err) {
    handleEditItemError(err, res, next);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const response = await axios.getInstance().delete(`/items/${req.params.id}`);
    if (response.status !== 204) return;
    res.redirect('/spending-assistant/items');
  } catch (err) {
    handleDeleteItemError(err, res, next);
  }
};

router.get('/', getItemList);
router.get('/add', getItemAdd);
router.get('/:id', getItemDetails);
router.get('/:id/purchase', getItemPurchase);
router.get('/:id/edit', getItemEdit);
router.get('/:id/delete', getItemDelete);
router.post('/add', addItem, getItemAdd);
router.post('/:id/purchase', purchaseItem, getItemPurchase);
router.post('/:id/edit', editItem, getItemEdit);
router.post('/:id/delete', deleteItem);

module.exports = router;
