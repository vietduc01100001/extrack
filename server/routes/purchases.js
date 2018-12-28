const router = require('express').Router();
const axios = require('../axios');
const {
  handlePurchaseListError,
  handlePurchaseStatsError,
  handlePurchaseError,
  handleEditPurchaseError,
  handleDeletePurchaseError,
} = require('../utils/error-handlers');
const {
  getCache,
  deleteCache,
  getFormatDate,
  toStringMonth,
} = require('../utils');

const dateFormats = {
  short: { weekday: 'short', day: 'numeric' },
  long: { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' },
};

const getPurchaseList = async (req, res, next) => {
  const month = req.query.month || new Date().getMonth() + 1;
  const year = req.query.year || new Date().getFullYear();
  const query = `month=${month}&year=${year}&`;
  try {
    const response = await axios.getInstance().get(`/purchases?${query}sort=-purchaseDate`);
    if (response.status !== 200) return;
    const { purchases } = response.data;
    res.render('purchase-list', {
      purchases: purchases.map(purchase => ({
        ...purchase,
        dateString: getFormatDate(purchase.purchaseDate, dateFormats.short),
      })),
      total: purchases.length,
      year,
      month,
    });
  } catch (err) {
    handlePurchaseListError(err, res, next);
  }
};

const getPurchaseStats = async (req, res, next) => {
  const month = req.query.month || new Date().getMonth() + 1;
  const year = req.query.year || new Date().getFullYear();
  const query = `month=${month}&year=${year}&`;
  try {
    await getCache(`/purchases/_stats?${query}`, req, 3600);
    if (req.response.status !== 200) return;
    const { stats } = req.response.data;
    res.render('purchase-stats', {
      dateString: `${toStringMonth(month)} ${year}`,
      food: stats.food || 0,
      bills: stats.bills || 0,
      health: stats.health || 0,
      transport: stats.transport || 0,
      learning: stats.learning || 0,
      tech: stats.tech || 0,
      entertainment: stats.entertainment || 0,
      other: stats.other || 0,
      total: Object.values(stats).reduce((p, c) => p + c, 0),
    });
  } catch (err) {
    handlePurchaseStatsError(err, res, next);
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
    res.redirect(`/purchases/${req.params.id}`);
    deleteCache(`/purchases/${req.params.id}`);
  } catch (err) {
    handleEditPurchaseError(err, res, next);
  }
};

const deletePurchase = async (req, res, next) => {
  try {
    const response = await axios.getInstance().delete(`/purchases/${req.params.id}`);
    if (response.status !== 204) return;
    res.redirect('/purchases');
    deleteCache(`/purchases/${req.params.id}`);
  } catch (err) {
    handleDeletePurchaseError(err, res, next);
  }
};

router.get('/', getPurchaseList);
router.get('/stats', getPurchaseStats);
router.get('/:id', getPurchaseDetails);
router.get('/:id/edit', getPurchaseEdit);
router.get('/:id/delete', getPurchaseDelete);
router.post('/:id/edit', editPurchase);
router.post('/:id/delete', deletePurchase);

module.exports = router;
