// connection between JS and HTML elements
const list = document.getElementById('transaction-list');
const totalSpendingEl = document.getElementById('total-spending');
const expenseChartCtx = document.getElementById('expense-chart').getContext('2d');
const filterDateInput = document.getElementById('filter-date');
const filterCategoryInput = document.getElementById('filter-category');
const applyFiltersBtn = document.getElementById('apply-filters');

let transactions = [];
let totalSpending = 0;


