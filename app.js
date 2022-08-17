require('dotenv').config();
const express = require("express");
const app= express();
const port= process.env.PORT||2000;
const cookieParser= require("cookie-parser");
const User= require("./schema/user");
const jwt = require("jsonwebtoken")
const bcrypt= require("bcrypt");
const auth= require('./middleware/auth.js')
const product= require("./products/product.js")
const {registrationSchema,loginSchema,productSchema}= require("./apivalidation/apischema");



require("./db/conn");
app.use(cookieParser());
app.use(express.json());

app.get("/",(req  ,res)=>{
    res.send("hello from the home side");
})

app.get("/new",auth,(req,res)=>{
  res.send("welcome to the new page");
  
})


app.post("/register", async(req,res)=>{
  const{name,lastname,email,password,cpassword,phone}=req.body;
  if(!name||!lastname||!email||!password||!cpassword||!phone){
    res.send("please enter the all fileds");
  }
  const rightUser= await registrationSchema.validateAsync(req.body);
  if(!rightUser){
    res.send("user is not valid");
  }
try{
    const userExist=await User.findOne({email:email})
    if(userExist){
        res.send("user is already exist")
    }
    if(password===cpassword){
       const user= await new User(req.body);
       const saveUser= await user.save()
       console.log(saveUser);
       const token= user.generateAuthtoken();
       console.log(token)
       res.cookie("jwt",token,
       {expires: new Date(Date.now()+24*60*60*1000),
        httpOnly:true
    })
      
        res.send("user registration successfully");
    }

}catch(error){
res.send(error);
  }  
})




app.post("/login",async(req,res)=>{
const{email,password}=req.body;
const userValid= await loginSchema.validateAsync(req.body);
if(!userValid){
  res.send("please fill all the details carefully");
}
try{
const findUser= await User.findOne({email:email});
const isMatch= bcrypt.compare(password,findUser.password);

const token= await findUser.generateAuthtoken();

 res.cookie("jwt",token,{

  expires:new Date(Date.now()+24*60*60*1000),
  httpOnly:true
 })

if(isMatch){
    res.send("login completed");
}else{
  res.send("invalid password details");
}

}catch(error){
res.send(error)
}
})

app.get("/logout", auth, async(req,res)=>{
  
  try { 
      res.clearCookie("jwt");
    res.send("logout succesfully..")
 
    

  } catch (error) { console.log(error);
    res.status(404).send(error);
  }

})
//products routes//


app.post("/product", auth , async (req,res)=>{
  const validDetails= await productSchema.validateAsync(req.body);
  if(!validDetails){
    res.send("the given product details are not valid please enter it again")
  }

try{ 
   const details=  await new product(req.body);
  console.log(details);
  res.send("nice man!...")
  const saveProduct= await details.save();
  console.log(saveProduct);
  
}catch(err){
  res.send(err);
}


})
app.get("/product",async (req,res)=>{
  try{
  const findProduct= await product.find({})
  console.log(findProduct)
  res.send(findProduct)
  }catch(err){
    res.json({message:"error"})
  }
})

app.patch("/update/:id",auth,  async (req,res)=>{
  try{
    const _id= req.params.id;
    const productSave= await product.findOne({_id:_id})
    if(!productSave){
      res.send("product is not found")
    }else{
 const findProduct= await product.findByIdAndUpdate(req.params.id,req.body)
  console.log(findProduct)
  res.json ({message:"updated successful"})}

  
  }catch(err){
    res.send(err);
  }

})
app.delete("/productdeleted/:id", async (req,res)=>{
  try{
    const _id= req.params._id

    const findproduct= await product.findOne({_id:_id});
    if(!findproduct){
      res.send("product is not  find")
     
    }else{
  const deleteProduct= await product.findByIdAndDelete(req.params.id)
  console.log(deleteProduct)
  res.send("product is deleted succesfully")}
  }
  catch(err){
    res.send(err);
  }

})







app.listen(port,()=>{
    console.log(`server listen to the port number ${port}`);
})
