//import express from "express";
 require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const User=require("./models/User");
console.log("user model: ",User);

const plaidClient=require("./plaidClient");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/pfm");

mongoose.connection.once("open",()=>{
    console.log("MongoDB Connected");
});
app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

//FOR USER.JS
const bcrypt=require("bcryptjs");

app.post("/register",async(req,res)=>{

  const {name,email,password}=req.body;

  const hashedPassword=await bcrypt.hash(password,10);

  const user=new User({
    name,
    email,
    password:hashedPassword
  });

  await user.save();

  res.json({message: "User Registerd Successfully"});
});

//auth.js
const jwt=require("jsonwebtoken");

app.post("/login",async(req,res)=>{

  const {email,password}=req.body;

  const user=await User.findOne({email});

  if(!user){
    return res.status(400).json({message:"User not found"});
  }

  const isMatch=await bcrypt.compare(password, user.password);

  if(!isMatch){
    return res.status(400).json({message:"Invalid password"});
  }
  const token=jwt.sign({id:user._id},"secretkey");

  res.json({token});

}); 
//PLAIDCLIENT

app.post("/create_link_token", async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: "user-id",
      },
      client_name: "PFM Dashboard",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});app.post("/exchange_public_token", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // 🔍 check input

    const { public_token, email } = req.body;

    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const access_token = response.data.access_token;

    console.log("ACCESS TOKEN:", access_token); // 🔍 check token

    // 🔍 CHECK USER EXISTS
    const user = await User.findOne({ email });
    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ SAVE TOKEN
    user.access_token = access_token;
    await user.save();

    console.log("TOKEN SAVED SUCCESSFULLY");

    res.json({ message: "Token saved successfully" });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.get("/accounts", async (req, res) => {
  try {
    const { email } = req.query;

    // ✅ get user from DB
    const user = await User.findOne({ email });

    if (!user || !user.access_token) {
      return res.status(400).json({ message: "No bank linked" });
    }

    // ✅ use stored token
    const response = await plaidClient.accountsGet({
      access_token: user.access_token
    });

    res.json(response.data.accounts);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching accounts" });
  }
});
function getCategory(name) {
  name = name.toLowerCase();

  if (name.includes("swiggy") || name.includes("zomato"))
    return "Food";

  if (name.includes("amazon") || name.includes("flipkart"))
    return "Shopping";

  if (name.includes("uber") || name.includes("ola"))
    return "Transport";

  if (name.includes("salary") || name.includes("credit"))
    return "Income";

  if (name.includes("netflix") || name.includes("spotify"))
    return "Entertainment";

  return "Other";
}
app.get("/transactions", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    let income = 0;
    let expense = 0;
    let categories = {};

    // 👉 Plaid (only if connected)
    if (user.access_token) {
      const response = await plaidClient.transactionsGet({
        access_token: user.access_token,
        start_date: "2024-01-01",
        end_date: "2026-03-22",
      });

      const transactions = response.data.transactions;

      transactions.forEach(txn => {
        if (txn.amount > 0) {
          expense += txn.amount;

          const category = getCategory(txn.name);

          if (!categories[category]) {
            categories[category] = 0;
          }

          categories[category] += txn.amount;
        } else {
          income += Math.abs(txn.amount);
        }
      });
    }

    // 👉 Manual transactions
    const manual = user.manualTransactions || [];

    manual.forEach(txn => {
      if (txn.type === "income") {
        income += txn.amount;
      } else {
        expense += txn.amount;

        if (!categories[txn.category]) {
          categories[txn.category] = 0;
        }

        categories[txn.category] += txn.amount;
      }
    });

    // ✅ IMPORTANT RESPONSE
   res.json({
  income,
  expense,
  categories,
  transactions: user.manualTransactions || [] 
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});
app.get("/dashboard/category-summary", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });

    const response = await plaidClient.transactionsGet({
      access_token: user.access_token,
      start_date: "2024-01-01",
      end_date: "2026-03-22",
    });

    const transactions = response.data.transactions;

    let categories = {};

    transactions.forEach(txn => {
      if (txn.amount > 0) {  // only expenses
        const category = getCategory(txn.name);

        if (!categories[category]) {
          categories[category] = 0;
        }

        categories[category] += txn.amount;
      }
    });

    res.json(categories);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error" });
  }
});
app.get("/monthly-summary", async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email });

  const response = await plaidClient.transactionsGet({
    access_token: user.access_token,
    start_date: "2024-01-01",
    end_date: "2026-03-22",
  });

  const transactions = response.data.transactions;

  let monthly = {};

  transactions.forEach(txn => {
    const month = txn.date.substring(0, 7); // YYYY-MM

    if (!monthly[month]) {
      monthly[month] = 0;
    }

    if (txn.amount > 0) {
      monthly[month] += txn.amount;
    }
  });

  res.json(monthly);
});
app.post("/add-transaction", async (req, res) => {
  try {
    const { email, name, amount, type, date } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.manualTransactions) {
      user.manualTransactions = [];
    }

    const category = getCategory(name);

    user.manualTransactions.push({
      name,
      amount,
      type, // income / expense
      category,
      date: date || new Date().toISOString()
    });

    await user.save();

    res.json({ message: "Transaction added successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding transaction" });
  }
});
app.put("/edit-transaction", async (req, res) => {
  const { email, index, updatedTxn } = req.body;

  const user = await User.findOne({ email });

  user.manualTransactions[index] = updatedTxn;

  await user.save();

  res.json({ message: "Updated" });
});
app.delete("/delete-transaction", async (req, res) => {
  const { email, index } = req.body;

  const user = await User.findOne({ email });

  user.manualTransactions.splice(index, 1);

  await user.save();

  res.json({ message: "Deleted" });
});