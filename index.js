const express=require('express');

const app=express();

const mongoose=require('mongoose');
const Service=require('./models/Service.js');
const methodOverride=require("method-override");

const path=require('path');
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


main()  
.then(()=>{
    console.log("connection sucess");
})

.catch(err=> console.log(err));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/watsapp')

}
//index route 
app.get("/services",async(req,res)=>{
    let services=await Service.find();
    console.log(services);
    res.render("index.ejs",{services});

    });
app.get("/", (req, res) => {
    res.redirect("/services");
});
//new route
app.get("/services/new",(req,res)=>{
    res.render("new.ejs");
});


app.get("/services/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let service=await Service.findById(id);
    res.render("edit.ejs",{service});
});


//create route
app.post("/services", (req, res) => {
    let { serviceName, description, price } = req.body;
    if (!serviceName || typeof serviceName !== 'string' || serviceName.length > 100) {
        return res.status(400).send('Invalid service name');
    }

    if (!description || typeof description !== 'string' || description.length > 500) {
        return res.status(400).send('Invalid description');
    }

    price = parseFloat(price); // Convert to number
    if (isNaN(price) || price < 0) {
        return res.status(400).send('Invalid price');
    }

    let newService = new Service({
        serviceName: serviceName,
        description: description,
        price: price,
    });

    newService.save()
        .then(() => {
            console.log("Chat was saved");
        })
        .catch((err) => {
            console.log(err);
    });
    res.redirect("/services");
});

//ubdate route
app.put("/services/:id", async (req, res) => {
    let { id } = req.params;
    let { serviceName, description, price } = req.body; // Destructure the new fields

    try {
        let updatedService = await Service.findByIdAndUpdate(
            id, 
            { serviceName, description, price }, // Update fields accordingly
            { runValidators: true, new: true }
        );
        console.log(updatedService);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error"); // Return on error to prevent redirect
    }

    res.redirect("/services"); // Corrected URL
});


app.delete("/services/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedChat = await Service.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect("/services");
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).send("Internal Server Error");
    }
});





app.listen(8080,()=>{
    console.log("server is listining on port 8080");

});
