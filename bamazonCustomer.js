var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
const chalk = require('chalk');
 
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "bootcamp",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  DisplayAllItem();
  
});

function promptAction(){
    inquirer
    .prompt([
    {
        type: "input",
        message: "What item would you like to purchase?",
        name: "itemId"
    },
    {
        type:"input",
        message:"How many would you like to buy?",
        name: "quantity"
    }
])
    .then(function(response){
        checkingQuantity(response.itemId, response.quantity); 
    })
}
function DisplayAllItem() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // adding $ to prices.
    for(var i = 0 ; i < res.length; i++){

        res[i].price = "$ " + res[i].price; 
    }
    console.table(res);
    promptAction(); 
  });
}
function checkingQuantity(itemId, quantity){
    var query = "SELECT * FROM products WHERE item_id = ?"
    connection.query(query,[itemId], function(err, res) {
        if (err) throw err;
        // adding $ to prices.
        if( quantity <= res[0].stock_quantity){
            console.log(chalk.yellow.bold("Requesting items from server..."))
            updateQuantity(res, itemId, quantity);
        }
        else{
            console.log(chalk.yellow("We apologize for the inconvinience, Insufficient quantity!"));
            console.log(chalk.magentaBright("We only have "+ res[0].stock_quantity + "."))
            DisplayAllItem();
        }
      });
}
function updateQuantity(response, itemId, userQuantity){
    var newStockQuantity = response[0].stock_quantity - userQuantity
    console.log(newStockQuantity)
    var query = "Update products Set ? Where ?"
    connection.query(
        query,
        [
            {
                stock_quantity:newStockQuantity
            },
            {
                item_id:itemId
            }   
        ],
        function(error){
            if(error) throw error;
            else{
                console.log(chalk.cyan("Congrants, your order has been place."))
                console.log(chalk.red("Your total is "+ "$"+ response[0].price*userQuantity ))
                DisplayAllItem();
            } 
        }
    )
}