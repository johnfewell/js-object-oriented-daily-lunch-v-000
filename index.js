let store = {employers: [], customers: [], deliveries: [], trips: [], meals: []}

let customerId = 0
let deliveryId = 0
let mealId = 0
let employerId = 0

class Delivery {
  constructor(meal = {}, customer = {}) {
    this.id = ++deliveryId
    store.deliveries.push(this)
    if(meal){
      this.mealId = meal.id
    }
    if(customer){
      this.customerId = customer.id
    }
  }
  customer(){
    return store.customers.find(customer => {
      return customer.id === this.customerId
    });
  }
  meal(){
    return store.meals.find(meal => {
      return meal.id === this.mealId
    });
  }
}

class Meal {
  constructor(title, price) {
    this.title = title
    this.price = price
    this.id = ++mealId
    store.meals.push(this)
  }

  deliveries(){
    return store.deliveries.filter(delivery => {
      return delivery.mealId === this.id;
    });
  }

  customers(){
    return this.deliveries().map(delivery => {
      return delivery.customer()
    });
  }

  static byPrice(){
    return store.meals.sort(function (meal1, meal2) {
      return meal1.price < meal2.price
    })
  }
}

class Customer {
  constructor(name, employer) {
    this.name = name
    this.employer = employer
    this.id = ++customerId
    store.customers.push(this)
  }

  deliveries(){
    return store.deliveries.filter(delivery => {
      return delivery.customerId === this.id;
    });
  }

  meals(){
    return this.deliveries().map(delivery => {
      return delivery.meal()
    });
  }

  totalSpent() {
    return this.meals().reduce(function(sum, meal) {
      return sum + meal.price;
    }, 0);
  }
}

class Employer {
  constructor(name){
    this.name = name
    this.id = ++employerId
    store.employers.push(this)
  }

  mealTotals() {
      let allMeals = this.deliveries().map(delivery => {
        return delivery.meal();
      });
      let summaryObject = {};
      allMeals.forEach(function(meal) {
        summaryObject[meal.id] = 0;
      });
      allMeals.forEach(function(meal) {
        summaryObject[meal.id] += 1;
      });
      return summaryObject;
  }

  employees(){
    return store.customers.filter(customer => {
      return customer.employer.id === this.id;
    });
  }

  deliveries() {
    let allDeliveries = this.employees().map(employee => {
      return employee.deliveries();
    });
    let merged = [].concat.apply([], allDeliveries);
    return merged;
  }
  meals() {
    let allMeals = this.deliveries().map(delivery => {
      return delivery.meal();
    });
    let uniqueMeals = [...new Set(allMeals)];
    return uniqueMeals;

  }


}
