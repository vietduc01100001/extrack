const _handleListError = Model => (err, res, next) => {
  const model = Model.toLowerCase();
  if (err.response) {
    res.render(`${model}-list`, { errorMessage: `Error fetching ${model} list.` });
    console.log(err.response.data);
  } else {
    next(err);
  }
};

const _handleDetailsError = Model => (err, res, next) => {
  const model = Model.toLowerCase();
  if (err.response && err.response.status === 404) {
    res.render(`${model}-error`, { errorMessage: `${Model} not found.` });
  } else if (err.response.status >= 500) {
    res.render(`${model}-error`, { errorMessage: `Error fetching ${model}.` });
    console.log(err.response.data);
  } else {
    next(err);
  }
};

const _handleEditError = Model => (err, res, next) => {
  const model = Model.toLowerCase();
  if (err.response && err.response.status === 404) {
    res.render(`${model}-error`, { errorMessage: `${Model} not found.` });
  } else if (err.response.status === 422) {
    res.render(`${model}-error`, { errorMessage: 'Validation failed.' });
    console.log(err.response.data);
  } else if (err.response.status >= 500) {
    res.render(`${model}-error`, { errorMessage: `Error editing ${model}.` });
    console.log(err.response.data);
  } else {
    next(err);
  }
};

const _handleDeleteError = Model => (err, res, next) => {
  const model = Model.toLowerCase();
  if (err.response && err.response.status === 404) {
    res.render(`${model}-error`, { errorMessage: `${Model} not found.` });
  } else if (err.response.status >= 500) {
    res.render(`${model}-error`, { errorMessage: `Error deleting ${model}.` });
    console.log(err.response.data);
  } else {
    next(err);
  }
};

const handleAddItemError = (err, res, next) => {
  if (err.response && err.response.status === 422) {
    res.render('item-add-edit', {
      title: 'Adding new item',
      urlPath: 'add',
      actionText: 'Add',
      errorMessage: 'Validation failed.',
    });
    console.log(err.response.data);
  } else if (err.response.status >= 500) {
    res.render('item-error', { errorMessage: 'Error adding item.' });
    console.log(err.response.data);
  } else {
    next(err);
  }
};

const handlePurchaseItemError = (err, res, next) => {
  if (err.response && err.response.status === 404) {
    res.render('item-error', { errorMessage: 'Item not found.' });
  } else if (err.response.status === 422) {
    res.render('item-error', { errorMessage: 'Validation failed.' });
    console.log(err.response.data);
  } else if (err.response.status >= 500) {
    res.render('item-error', { errorMessage: 'Error purchasing item.' });
    console.log(err.response.data);
  } else {
    next(err);
  }
};

const handlePurchaseStatsError = (err, res, next) => {
  if (err.response) {
    res.render('purchase-error', { errorMessage: 'Error fetching purchase stats.' });
    console.log(err.response.data);
  } else {
    next(err);
  }
};

module.exports = {
  handleItemListError: _handleListError('Item'),
  handleItemError: _handleDetailsError('Item'),
  handleAddItemError,
  handlePurchaseItemError,
  handleEditItemError: _handleEditError('Item'),
  handleDeleteItemError: _handleDeleteError('Item'),
  handlePurchaseListError: _handleListError('Purchase'),
  handlePurchaseStatsError,
  handlePurchaseError: _handleDetailsError('Purchase'),
  handleEditPurchaseError: _handleEditError('Purchase'),
  handleDeletePurchaseError: _handleDeleteError('Purchase'),
};
