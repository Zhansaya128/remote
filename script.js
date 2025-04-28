// connection between JS and HTML elements
const list = document.getElementById('transaction-list');
const totalSpendingEl = document.getElementById('total-spending');
const expenseChartCtx = document.getElementById('expense-chart').getContext('2d');
const filterDateInput = document.getElementById('filter-date');
const filterCategoryInput = document.getElementById('filter-category');
const applyFiltersBtn = document.getElementById('apply-filters');
const addExpenseBtn = document.getElementById("add-expense");
const clearFiltersBtn = document.getElementById('clear-filters');

let transactions = [];
let totalSpending = 0;

//chart establishment
const expenseChart = new Chart(expenseChartCtx, {
  type: 'doughnut',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['red', 'green', 'purple', 'blue', 'brown']
    }]
  }
});

// collecting data through pop up promts 
addExpenseBtn.addEventListener('click', () => {
  const amount = parseFloat(prompt('Enter amount (IMPORTANT: only digits and no spaces):'));
  const category = prompt('Enter category (wage/food/subscriptions and etc.?):');
  const type = prompt('Enter type (income/expense IMPORTANT - enter it through lowercase letters 0NLY):');
  const description = prompt('Enter description:');
  const dateInput = prompt('Enter date (IMPORTANT: enter it through dashes in this style: YYYY-MM-DD):') || new Date().toISOString().split('T')[0];

  if(!/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    alert ("Invalid date format! Please enter the date in YYYY-MM-DD format!");
    return;
  }

  const transaction = {
    id: Date.now(), 
    amount,
    category,
    type,
    description,
    date: dateInput
  };

  transactions.push(transaction);
  renderTransactions(transactions);
  updateChart();
});

// the funcation of applying the filters
applyFiltersBtn.addEventListener('click', () => {
  const date = filterDateInput.value;
  const category = filterCategoryInput.value.toLowerCase();

  const filtered = transactions.filter(tx => {
    return (!date || tx.date === date) && (!category || tx.category.toLowerCase().includes(category));
  });

  renderTransactions(filtered);
});

clearFiltersBtn.addEventListener('click', () =>{
  filterDateInput.value='';
  filterCategoryInput.value='';
  renderTransactions(transactions);
});

//presentation of the collected data 
function renderTransactions(items) {
  list.innerHTML = '';
  totalSpending = 0;

  items.forEach(tx => {
    const li = document.createElement('li');

    const left = document.createElement('div');
    left.innerHTML = `<strong>${tx.date}</strong> - ${tx.category} (${tx.type})<br/>${tx.description}`;
    
    const right = document.createElement('div');
    right.innerHTML = `₸${tx.amount}`;

    //delete button 
    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.style.marginLeft = '10px';
    delBtn.style.background = 'transparent';
    delBtn.style.color = '#f55';
    delBtn.style.border = 'none';
    delBtn.style.cursor = 'pointer';

    delBtn.addEventListener('click', () => {
      transactions = transactions.filter(t => t.id !== tx.id);
      renderTransactions(transactions);
      updateChart();
    });

    const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.appendChild(right);
        wrapper.appendChild(delBtn);

        li.appendChild(left);
        li.appendChild(wrapper);
        list.appendChild(li);

        if (tx.type === 'income') totalSpending += tx.amount;
        else if (tx.type === "expense") totalSpending -= tx.amount;
      });

      totalSpendingEl.textContent = totalSpending.toFixed(2);
    }

// update of the chart
    function updateChart() {
      const categories = {};
      transactions.forEach(t => {
        if (t.type === 'expense') {
          categories[t.category] = (categories[t.category] || 0) + t.amount;
        }
      });
      expenseChart.data.labels = Object.keys(categories);
      expenseChart.data.datasets[0].data = Object.values(categories);
      expenseChart.update();
    }


    