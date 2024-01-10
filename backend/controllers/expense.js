const ExpenseSchema = require("../models/ExpenseModel")


exports.addExpense = async (req, res) => {
    const {title, amount, category, description, date} = req.body

    const amountWithDot = amount.replace(',', '.');

    const expense = ExpenseSchema({
        title, 
        amount: parseFloat(amountWithDot),
        category,
        description,
        date
    })

    try {
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'Wszystkie pola muszą być wypełnione'})
        }
        if(amount  <= 0 || !amount === 'number'){
            return res.status(400).json({message: 'Kwota musi być liczcbą dodatnią'})
        }
        if (description.length > 30) {
            return res.status(400).json({ message: 'Opis może mieć maksymalnie 30 znaków' });
        }
        await expense.save()
        res.status(200).json({message: 'Expense added succesfully!'})
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }

    console.log(expense)
}

exports.getExpense = async (req, res) => {
    try {
        const expenses = await ExpenseSchema.find().sort({createdAt: -1})
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteExpense = async (req, res) => {
    const {id} = req.params;
    ExpenseSchema.findByIdAndDelete(id)
    .then((expense)=>{
        res.status(200).json({message: 'Expense Deleted'})
    })
    .catch((err) =>{
        res.status(500).json({message: 'Server Error'})
    })
}