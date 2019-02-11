const router = require('express').Router();
const axios = require('../axios');
const { validatePurchaseItem } = require('../validations');
const { toString } = require('../utils');

const getCart = (req, res) => {
  res.render('cart');
};

const renderItems = async (req, res) => {
  const { items } = req.body;
  try {
    const results = await Promise.all(items.map(id => axios.getInstance().get(`/items/${id}`)));
    const rendered = results
      .map(r => {
        const { item } = r.data;
        const costSelection = `<select id="${item._id}-cost">`
          + item.costs.map(c => `<option value="${c}">${c}k</option>`).join('')
          + '</select>';
        const quantityInput = `<input type="number" id="${item._id}-quantity" value="1">`;
        return '<div class="item">'
          + `<p>Item: ${item.name}</p>`
          + `<span class="red-button float-right" onclick="removeItem('${item._id}')">X</span>`
          + '<div>Cost:</div>'
          + costSelection
          + '<div>Quantity:</div>'
          + quantityInput
          + '</div>'
      })
      .join('');
    res.status(200).send(rendered);
  } catch (err) {
    res.status(500).end();
  }
};

const purchaseCart = async (req, res, next) => {
  const { isValid, errors } = validatePurchaseItem(req.body);
  if (!isValid) {
    const errorMessage = toString(errors);
    return res.status(422).json({ error: errorMessage });
  }
  try {
    const { items, description } = req.body;
    const requestBody = {
      items: [],
      purchaseDate: new Date(),
      description
    };
    await Promise.all(items.map(item => new Promise((resolve, reject) => {
      axios.getInstance()
        .get(`/items/${item._id}`)
        .then(response => {
          if (response.status === 200) {
            requestBody.items.push({
              _id: item._id,
              name: response.data.item.name,
              cost: parseInt(item.cost),
              quantity: parseInt(item.quantity)
            });
            resolve();
          }
        })
        .catch(err => reject(err));
    })));
    const purchasesRes = await axios.getInstance().post('/purchases', requestBody);
    if (purchasesRes.status !== 201) return;
    const purchaseId = purchasesRes.data.purchase._id;
    res.status(201).json({ url: `/purchases/${purchaseId}` });
  } catch (err) {
    if (err.response && err.response.status) {
      res.status(500).json({ error: 'Error purchasing items.' });
      console.log(err.response.data);
    } else {
      next(err);
    }
  }
};

router.get('/', getCart);
router.post('/', renderItems);
router.post('/purchase', purchaseCart);

module.exports = router;
