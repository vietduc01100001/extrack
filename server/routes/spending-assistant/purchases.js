const router = require('express').Router();
const axios = require('../../axios');
const {
  handlePurchaseListError,
  handlePurchaseError,
  handleEditPurchaseError,
  handleDeletePurchaseError,
} = require('./error-handlers');
const { getCache, deleteCache, getFormatDate } = require('./utils');

const dateFormats = {
  short: { weekday: 'short', month: 'short', day: 'numeric' },
  long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
};

const getPurchaseList = async (req, res, next) => {
  try {
    await getCache('/purchases?sort=-purchaseDate', req, 60);
    if (req.response.status !== 200) return;
    const { purchases } = req.response.data;
    res.render('purchase-list', {
      purchases: purchases.map(purchase => ({
        ...purchase,
        dateString: getFormatDate(purchase.purchaseDate, dateFormats.short),
      })),
      total: purchases.length,
    });
  } catch (err) {
    handlePurchaseListError(err, res, next);
  }
};

const getPurchaseDetails = async (req, res, next) => {
  try {
    await getCache(`/purchases/${req.params.id}`, req);
    if (req.response.status !== 200) return;
    const { purchase } = req.response.data;
    res.render('purchase-details', {
      ...purchase,
      dateString: getFormatDate(purchase.purchaseDate, dateFormats.long),
    });
  } catch (err) {
    handlePurchaseError(err, res, next);
  }
};

const getPurchaseEdit = async (req, res, next) => {
  try {
    await getCache(`/purchases/${req.params.id}`, req);
    if (req.response.status !== 200) return;
    res.render('purchase-edit', req.response.data.purchase);
  } catch (err) {
    handlePurchaseError(err, res, next);
  }
};

const getPurchaseDelete = async (req, res, next) => {
  try {
    await getCache(`/purchases/${req.params.id}`, req);
    if (req.response.status !== 200) return;
    res.render('purchase-delete', req.response.data.purchase);
  } catch (err) {
    handlePurchaseError(err, res, next);
  }
};

const editPurchase = async (req, res, next) => {
  try {
    const response = await axios.getInstance().patch(`/purchases/${req.params.id}`, req.body);
    if (response.status !== 200) return;
    res.redirect(`/spending-assistant/purchases/${req.params.id}`);
    deleteCache(`/purchases/${req.params.id}`);
  } catch (err) {
    handleEditPurchaseError(err, res, next);
  }
};

const deletePurchase = async (req, res, next) => {
  try {
    const response = await axios.getInstance().delete(`/purchases/${req.params.id}`);
    if (response.status !== 204) return;
    res.redirect('/spending-assistant/purchases');
    deleteCache(`/purchases/${req.params.id}`);
  } catch (err) {
    handleDeletePurchaseError(err, res, next);
  }
};

router.get('/', getPurchaseList);
router.get('/:id', getPurchaseDetails);
router.get('/:id/edit', getPurchaseEdit);
router.get('/:id/delete', getPurchaseDelete);
router.post('/:id/edit', editPurchase);
router.post('/:id/delete', deletePurchase);

module.exports = router;
