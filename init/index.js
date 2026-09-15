const mongoose = require("mongoose");
const initData = require("./data.js")

const listing=require("../models/listing.js");

const mongoURL="mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("connected to db");
}).catch(err=>console.log("connection failed to DB"));



async function main(){
    await mongoose.connect(mongoURL);
}


const initDB = async ()=>{

    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=> ({...obj,owner:"6a884d4a291bce3f963f4a04"}))
    await listing.insertMany(initData.data);
    console.log("data was initialised");
};


initDB();