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
  displayAllItem();
  
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
function displayAllItem() {
    var columns = "item_id as 'Item ID', "
    columns+= "product_name as 'Product Name', "
    columns+= "department_name as 'Department Name', "
    columns+= "price as Price , "
    columns+= "stock_quantity as 'Stock Quantity' "
  connection.query("SELECT "+ columns + " FROM products", function(err, res) {
    if (err) throw err;
    var table = res
    for(var i = 0; i < table.length; i++){
        table[i].Price ="$" + table[i].Price
    }

    console.table(table);
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
            displayAllItem();
        }
      });
}
function updateQuantity(response, itemId, userQuantity){
    var newStockQuantity = response[0].stock_quantity - userQuantity
 
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
                updateProductSales(response,userQuantity);
               
                
                
                
            } 
        }
    )
}
function updateProductSales(response, userQuantity){
    var productSales = response[0].price*userQuantity
    var query = "Update products Set ? Where ?"
    connection.query(
        query,
        [
            {
                product_sales:productSales
            },
            {
                item_id:response[0].item_id
            }   
        ],
        function(error){
            if(error) throw error;
            console.log(chalk.cyan("Congrants, your order has been place."));
            console.log(chalk.red("Your total is "+ "$" + (response[0].price * parseFloat(userQuantity)) ));
            displayAllItem();
        }
    )
}
function numberWithCommas(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }