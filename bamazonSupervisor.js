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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    promptAction();

});

function promptAction() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What item would you like to purchase?",
                name: "action",
                choices: [
                    {
                        name: "View Products for Sale (Order by Department)", value: 1
                    },
                    {
                        name: "Create Department", value: 3
                    },
                    {
                        name: "Exit", value: 5
                    }
                ]
            }
        ])
        .then(function (response) {
            switch (response.action) {
                case 1:
                    displayAllItem();
                    break;
                case 2:
                    lowerThanFiveItems();
                    break;
                case 3:
                    addDepartment();
                 break;
                case 5: 
                    console.log(chalk.yellow("Logging out"))
                    connection.end();
                    break;
            }
        })
}
function displayAllItem() {
    console.clear();
    var query = "Select  department_id as 'Department ID', departments.department_name as " 
    query+="'Department Name', departments.over_head as 'Overhead', " 
    query+="sum(product_sales) as Totals, (sum(product_sales) - departments.over_head) as Profit "
    query += "From departments left join products "
    query += "on departments.department_name = products.department_name " 
    query+= "group by departments.department_name"
    
    
    connection.query(query, function (err, res) {
        if (err) throw err;
        var table = res
        // adding $  styling hearders
        for (var i = 0; i < table.length; i++) {
            if(table[i].Overhead){
                table[i].Overhead = "$ " + numberWithCommas(table[i].Overhead);
            }
            if(table[i].Totals){
                table[i].Totals = "$ " + numberWithCommas(table[i].Totals);
            }
            if(table[i].Profit){
                table[i].Profit = "$ " + numberWithCommas(table[i].Profit);
            }
        }
        console.table(res);

        promptAction();
    });
}
function insertDepartments(departmentName, overhead) {
    
    var query = "insert into departments set ?"

    connection.query(
        query,
        {
            department_name: departmentName,
            over_head: overhead
        },
        function (error) {
            if (error) throw error;
            console.log(chalk.cyan("Department added"))
            promptAction();
        })
}
function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What department would you like to add?",
                name: "departmentName",
                //add validation to this so user cannot enter and unknow item. 
            },
            {
                message: "What is the over head price?",
                type:"input",
                name:"overhead"
                // add validation to this so user cannot ender below zero quantity.
            }
        ])
        .then(function (response) {
            insertDepartments(response.departmentName,response.overhead);

        })
}
function numberWithCommas(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

