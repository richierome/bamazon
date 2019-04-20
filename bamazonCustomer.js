var mysql = require("mysql");
var inquirer = require("inquirer");
// var questions = [
//   {
//     name: 'question 1',
//     message: 'what do you want to buy?',
  
//   },
// {
//   name:'question 2',
//   message: ' how much do want to buy?'
// }
 
// ];
// inquirer
//   .prompt(questions)
//   .then(answers => {
//     // Use user feedback for... whatever!
//     console.log(answers);
//   });
  

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "webuser",

  // Your password
  password: "UCR",
  database: "bamazon"
});





connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  bamazon();
});
//created a varable bamazon and set it to a function, then we used connection.query to connect to bamazon data base in mysql database table and
//console loged the results//

var bamazon = function() {
  connection.query ('select * from bamazon', function(err,results) {
    if (err) throw err;
    console.log(results);

    var questions = [
      {
        name: 'question 1', //object property #1
        message: 'what do you want to buy?',
      
      },
    {
      name:'question 2', //object property #2
      message: ' how much do want to buy?'
    }
     
    ];
    inquirer
      .prompt(questions)
      .then(answers => {
        // Use user feedback for... whatever!
        console.log(answers);
        stockQuantity(answers['question 1'], answers['question 2'] );
      });


  });
}

//ask customer what would they like to buy, then run a fuction to check if its an item in stock_quantity.
// if item is in stock_quantity and its in stock then make purchase .
// if item is not in stock or not an item to purchase than say not available //

var stockQuantity = function(item, quantity){
console.log(item);
console.log(quantity);
  connection.query('select * from bamazon where ?', { item_id: item }, function(err,results) {
    if (err) throw err;
    console.log(results);

    // stockData is the object from results
    var stockData = results[0];

    // Subtract quantity from the stock_quantity
    //we created a new var called randomStockQuantity and set it equal to stockData.stock_quantity then subtracted it from quantity 
    // when a purchase is made it will update the stock quantity to reflect the purchase.
    var randomStockQuantity = stockData.stock_quantity - quantity;
    console.log(randomStockQuantity);

    if (randomStockQuantity < 0) {
      console.log("not enough in stock for purchase");
      
    } else { 
      connection.query(
      "UPDATE bamazon SET ? WHERE ?",
      [
        {
          stock_quantity: randomStockQuantity
        },
        {
          item_id: item
        }
      ],
      function(err, res) {
        console.log("Product purchased!\n");
        console.log("$" + (quantity * stockData.price));
      }
    );
      
    }
  
  });

}

