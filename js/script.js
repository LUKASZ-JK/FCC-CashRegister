'use strict';

let price = 3.26;
let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]];

let cashValue = [
   0.01,
   0.05,
   0.10,
   0.25,
   1,
   5,
   10,
   20,
   100,
]

let cashToGive = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const userInput = document.getElementById('cash');
const resultsDiv = document.getElementById('change-due')
let cash;

const purchaseButton = document.getElementById('purchase-btn');
purchaseButton.addEventListener('click', purchaseItem)

function clearForm() {
   while (resultsDiv.firstChild) {
      resultsDiv.removeChild(resultsDiv.firstChild);
   }
}

function purchaseItem(e) {
   e.preventDefault();
   clearForm();
   cash = Number(userInput.value);
   if (!cash) {
      return;
   }
   if (cash < price) {
      alert('Customer does not have enough money to purchase the item');
      return;
   }
   const result = document.createElement('span');
   if (cash === price) {
      result.innerText = 'No change due - customer paid with exact cash';
      resultsDiv.appendChild(result);
      return;
   }
   let cashInDrawer = sumRegisterMoney(cid);
   const changeDue = cash - price;
   if (cashInDrawer < changeDue) {
      result.innerText = 'Status: INSUFFICIENT_FUNDS';
      resultsDiv.appendChild(result);
   }
   else {
      result.innerText = tryGivingChange();
      resultsDiv.appendChild(result);
      showRegisterMoney();
   }
};

function sumRegisterMoney(register) {
   let sum = 0;
   register.forEach(money => {
      sum += money[1];
   })
   return sum;
}

function showRegisterMoney() {
   for (let i = cashToGive.length - 1; i >= 0; i--) {
      if (cashToGive[i] > 0) {
         const moneyItem = document.createElement('span');
         moneyItem.innerText = `${cid[i][0]}: $${cashToGive[i]}`
         resultsDiv.appendChild(moneyItem);
      }
   }
}

function tryGivingChange() {
   let remainderToGive = cash - price;
   let operatingCid = cid.slice();
   for (let i = operatingCid.length - 1; i >= 0; i--) {
      const currentRegisterTotalCash = (operatingCid[i][1]);
      const currentRegisterCashValue = cashValue[i];
      if (remainderToGive > 0) {
         if (remainderToGive >= currentRegisterTotalCash) {
            remainderToGive = Number((remainderToGive - currentRegisterTotalCash).toFixed(2));
            operatingCid[i][1] = 0;
            cashToGive[i] = currentRegisterTotalCash;
         }
         else {
            const amount = Math.floor(remainderToGive / currentRegisterCashValue);
            if (amount > 0) {
               const cashGivenBack = Number((currentRegisterCashValue * amount).toFixed(2));
               remainderToGive = Number((remainderToGive - cashGivenBack).toFixed(2));
               operatingCid[i][1] -= cashGivenBack;
               cashToGive[i] = cashGivenBack;
            }
         }
      }
   }

   const leftoverMoney = sumRegisterMoney(operatingCid);
   if (leftoverMoney < 0 || remainderToGive > 0) {
      cashToGive = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      return 'Status: INSUFFICIENT_FUNDS'
   }
   if (leftoverMoney === 0) {
      cid = operatingCid;
      return 'Status: CLOSED'
   }
   if (leftoverMoney > 0) {
      cid = operatingCid;
      return 'Status: OPEN'
   }
}