const mongoose= require("mongoose");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

const userSchema=  new mongoose.Schema({

name:{
    type:String,
    required:true,
    trim:true
    
},
lastname:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    trim:true
},
password:{
    type:String,
    required:true
},
phone:{
    type:String,
    required:true
}
 
})
//jsonweb token//
userSchema.methods.generateAuthtoken= async function(){
try{
    const token = jwt.sign({_id:this._id},process.env.KEY);
    return token;
}catch(error){
 console.log(error);
}

}




//password hashing//
userSchema.pre("save", async function(next){
    if (this.isModified("password"))
    {console.log(`the current password is the ${this.password}`);
    this.password=  await bcrypt.hash(this.password,10);
    console.log(`the currnt passwird is the ${this.password}`);

    }
    next();

})




const User=  new mongoose.model("User",userSchema);
module.exports= User;

