//Objet CONTROLLER
const itemCtrl = (function () {
  //objet constructeur
  const Item = function (id, description, amount) {
    this.id = id;
    this.description = description;
    this.amount = amount;
  };
  //Structure de données
  const data = {
    items: [],
  };
  //méthode publique
  return {
    logData: function () {
      return data;
    },
    addMoney: function (description, amount) {
      //créer un identifiant aléatoire
      let ID = itemCtrl.createID();
      //créer un nouvel élément
      newMoney = new Item(ID, description, amount);
      //poussez-le dans le tableau
      data.items.push(newMoney);

      return newMoney;
    },
    createID: function () {
      //créer un numéro d'identification aléatoire entre 0 et 10000
      const idNum = Math.floor(Math.random() * 10000);
      return idNum;
    },
    getIdNumber: function (item) {
      //obtenir l'identifiant de l'article
      const amountId = item.parentElement.id;
      //casser l'identifiant dans un tableau
      const itemArr = amountId.split("-");
      //obtenir le numéro d'identification
      const id = parseInt(itemArr[1]);

      return id;
    },
    deleteAmountArr: function (id) {
      //obtenir tous les identifiants
      const ids = data.items.map(function (item) {
        //renvoyer l'article avec l'identifiant
        return item.id;
      });
      //obtenir l'index
      const index = ids.indexOf(id);
      //retirer ou supprimmer l'objet
      data.items.splice(index, 1);
    },
  };
})();

//CONTRÔLEUR UI
const UICtrl = (function () {
  //sélecteurs d'interface utilisateur (UI)
  const UISelectors = {
    incomeBtn: "#add__income",
    expenseBtn: "#add__expense",
    description: "#description",
    amount: "#amount",
    moneyEarned: "#amount__earned",
    moneyAvailable: "#amount__available",
    moneySpent: "#amount__spent",
    incomeList: "#income__container",
    expensesList: "#expenses__container",
    incomeItem: ".income__amount",
    expenseItem: ".expense__amount",
    itemsContainer: ".items__container",
  };
  //méthodes publiques
  return {
    //retourner les sélecteurs d'interface utilisateur (UI)
    getSelectors: function () {
      return UISelectors;
    },
    getDescriptionInput: function () {
      return {
        descriptionInput: document.querySelector(UISelectors.description).value,
      };
    },
    getValueInput: function () {
      return {
        amountInput: document.querySelector(UISelectors.amount).value,
      };
    },
    addIncomeItem: function (item) {
      //créer une nouvelle div
      const div = document.createElement("div");
      //ajouter une classe
      div.classList = "item income";
      //ajouter un identifiant à l'article
      div.id = `item-${item.id}`;
      //ajouter du HTML
      div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__income">
                <p class="symbol">+ </p>
                <span class="income__amount">${item.amount}</span>
            </div>
            <i class="far fa-trash-alt"></i>
            `;
      //insérer les revenus dans la liste
      document
        .querySelector(UISelectors.incomeList)
        .insertAdjacentElement("beforeend", div);
    },
    clearInputs: function () {
      document.querySelector(UISelectors.description).value = "";
      document.querySelector(UISelectors.amount).value = "";
    },
    updateSpent: function () {
      //tous les éléments de revenu
      const allIncome = document.querySelectorAll(UISelectors.incomeItem);
      //tableau avec tous les revenus
      const incomeCount = [...allIncome].map((item) => +item.innerHTML);
      //calculer le total gagné(earned)
      const incomeSum = incomeCount.reduce(function (a, b) {
        return a + b;
      }, 0);
      //afficher le total gagné
      const icomeTotal = (document.querySelector(
        UISelectors.moneySpent
      ).innerHTML = incomeSum.toFixed(2));
    },
    addExpenseItem: function (item) {
      //créer une nouvelle div
      const div = document.createElement("div");
      // ajouter une classe
      div.classList = "item expense";
      // ajouter un identifiant à l'article
      div.id = `item-${item.id}`;
      // ajouter du html
      div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__expense">
                <p class="symbol">-</p>
                <span class="expense__amount">${item.amount}</span>
            </div>
            <i class="far fa-trash-alt"></i>
            `;
      //insérer les revenus dans la liste
      document
        .querySelector(UISelectors.expensesList)
        .insertAdjacentElement("beforeend", div);
    },
    updateEarned: function () {
      //tous les éléments de dépenses
      const allExpenses = document.querySelectorAll(UISelectors.expenseItem);
      //tableau tous frais
      const expenseCount = [...allExpenses].map((item) => +item.innerHTML);
      //calculer le total
      const expenseSum = expenseCount.reduce(function (a, b) {
        return a + b;
      }, 0);
      // afficher le total dépensé
      const expensesTotal = (document.querySelector(
        UISelectors.moneyEarned
      ).innerHTML = expenseSum);
    },
    updateAvailable: function () {
      const earned = document.querySelector(UISelectors.moneyEarned);
      const spent = document.querySelector(UISelectors.moneySpent);
      const available = document.querySelector(UISelectors.moneyAvailable);
      available.innerHTML = (+earned.innerHTML - +spent.innerHTML).toFixed(2);
    },
    deleteAmount: function (id) {
      //créer l'identifiant que nous sélectionnerons
      const amountId = `#item-${id}`;
      // sélectionnez le montant avec l'identifiant que nous avons passé
      const amountDelete = document.querySelector(amountId);
      // supprimer de l'interface utilisateur(UI)
      amountDelete.remove();
    },
  };
})();

//APP CONTRÔLEUR
const App = (function () {
  //auditeurs d'événements
  const loadEventListeners = function () {
    //obtenir des sélecteurs d'interface utilisateur
    const UISelectors = UICtrl.getSelectors();

    //ajouter de nouveaux revenus
    document
      .querySelector(UISelectors.incomeBtn)
      .addEventListener("click", addIncome);

    //ajouter de nouveaux depenses
    document
      .querySelector(UISelectors.expenseBtn)
      .addEventListener("click", addExpense);

    //effacer l'article
    document
      .querySelector(UISelectors.itemsContainer)
      .addEventListener("click", deleteItem);
  };

  //ajouter de nouveaux revenus
  const addIncome = function () {
    //obtenir la description et les valeurs de montant
    const description = UICtrl.getDescriptionInput();
    const amount = UICtrl.getValueInput();

    //si les entrées ne sont pas vides
    if (description.descriptionInput !== "" && amount.amountInput !== "") {
      //Ajoute un nouvel objet
      const newMoney = itemCtrl.addMoney(
        description.descriptionInput,
        amount.amountInput
      );
      //ajouter un élément à la liste
      UICtrl.addIncomeItem(newMoney);

      //effacer les entrées(input)
      UICtrl.clearInputs();
      //mise à jour gagnée
      UICtrl.updateSpent();
      //calculate l'argent disponible (money available)
      UICtrl.updateAvailable();
    }
  };

  //ajouter une nouvelle dépense
  const addExpense = function () {
    //obtenir la description et les valeurs de montant
    const description = UICtrl.getDescriptionInput();
    const amount = UICtrl.getValueInput();
    //si les entrées ne sont pas vides
    if (description.descriptionInput !== "" && amount.amountInput !== "") {
      //Ajoute un nouvel objet
      const newMoney = itemCtrl.addMoney(
        description.descriptionInput,
        amount.amountInput
      );
      //ajouter un élément à la liste
      UICtrl.addExpenseItem(newMoney);
      //effacer les entrées
      UICtrl.clearInputs();
      //mettre à jour le total dépensé
      UICtrl.updateEarned();
      //calculer l'argent disponible
      UICtrl.updateAvailable();
    }
  };

  //effacer l'article
  const deleteItem = function (e) {
    if (e.target.classList.contains("far")) {
      //obtenir le numéro d'identification
      const id = itemCtrl.getIdNumber(e.target);
      //supprimer le montant de l'interface utilisateur
      UICtrl.deleteAmount(id);
      //supprimer le montant des données
      itemCtrl.deleteAmountArr(id);
      //mise à jour gagnée
      UICtrl.updateSpent();
      //mettre à jour le total dépensé
      UICtrl.updateEarned();
      //calculer l'argent disponible
      UICtrl.updateAvailable();
    }

    e.preventDefault();
  };

  //fonction d'initialisation
  return {
    init: function () {
      loadEventListeners();
    },
  };
})(itemCtrl, UICtrl);

App.init();
