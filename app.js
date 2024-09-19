// State management
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const errorMessage = document.getElementById('error-message');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayTransactions();
    updateBalance();
    resetCanvas();
    console.log('Transactions:', transactions);
    renderChart();
});

transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTransaction();
});

// Add a new transaction
function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = +amountInput.value.trim();

    // Simple validation
    if (description === '' || amount === 0) {
        errorMessage.textContent = 'Please provide a valid description and amount';
        errorMessage.classList.remove('hidden');
        return;
    }

    // Clear error message
    errorMessage.classList.add('hidden');

    const transaction = {
        id: generateID(),
        description,
        amount,
    };

    transactions.push(transaction);
    updateLocalStorage();
    displayTransactions();
    updateBalance();
    renderChart();

    // Clear form inputs
    descriptionInput.value = '';
    amountInput.value = '';
}

// Generate a random ID
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Display all transactions
function displayTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach((transaction) => {
        const li = document.createElement('li');
        li.textContent = `${transaction.description}: ${transaction.amount} IDR`;

        if (transaction.amount < 0) {
            li.classList.add('negative');
        } else {
            li.classList.add('positive');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', () => {
            deleteTransaction(transaction.id);
        });
        li.appendChild(deleteBtn);

        transactionList.appendChild(li);
    });
}

// Delete a transaction
function deleteTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateLocalStorage();
    displayTransactions();
    updateBalance();
    renderChart();
}

// Update balance
function updateBalance() {
    const totalBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceDisplay.textContent = `${totalBalance.toFixed(0)} IDR`;
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function resetCanvas() {
    const canvas = document.getElementById('expense-chart');
    const container = canvas.parentNode;
    container.removeChild(canvas);

    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'expense-chart';
    container.appendChild(newCanvas);
}

let chartInstance;
// Render Chart
function renderChart() {
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0) * -1;

    const ctx = document.getElementById('expense-chart').getContext('2d');
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expenses],
                backgroundColor: ['#28a745', '#dc3545'],  // Green for income, red for expenses
                borderColor: ['#fff'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        }
    });
}