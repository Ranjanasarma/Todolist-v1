const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app=express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-ranjana:Test123@cluster0.r5nig.mongodb.net/todolistDB", {useNewUrlParser:true});
const itemsSchema ={
    name: String

};
const Item=mongoose.model("Item",itemsSchema);
const Item1 = new Item({
    name:"welcome to your to do list!"

});
const Item2 = new Item({
    name:"hit the + button  to add an new item!"

});
const Item3 = new Item({
    name:"<-- hit the  button  to delete an  item!"

});
const defaultItems= [Item1,Item2,Item3];
const ListSchema ={
    name:String,
    items:[itemsSchema]
};
const List = mongoose.model("List",ListSchema);




app.get("/", function(req, res){
    Item.find({},function(err, foundItems){
        if (foundItems.length ===0){
            Item.insertMany(defaultItems,function(err){
                 if (err){
                     console.log(err);
                 } else    {
                    console.log("successfully save default item to the DB.");
                  }
             });
             res.redirect("/");
        }else {
            res.render("list",{listTitle:"Today" ,newListItems: foundItems});
        }

        
    });
    });

    

  app.get("/:customListName",function(req,res){
      const customListName=req.params.customListName;

      List.findOne({name:customListName},function(err,foundList){
          if(!err){
              if(!foundList){
                  // create a new list
                  const list = new List({
                    name:customListName,
                    items:defaultItems,
                });
                  list.save();
              }else{
                 // show an exsisting list
                 res.render("List",{listTitle:foundList.name ,newListItems: foundList.items});
              }
              }
          

      
      
      });
      
  } );   
    

app.post("/", function(req,res){
    const itemName =  req.body.newItem;
    const item= new Item ({
        name:itemName
 });
   item.save();
   res.redirect("/");
});
   app.post("/delete",function(req,res){
       const checkedItemId = req.body.checkbox;
       Item.findByIdAndRemove(checkedItemId,function(err){
if(!err){
    console.log("succesfully deleted checked item");
    res.redirect("/");
}
         });
   });
  

  

  app.get("/about",function(req,res){
      res.render("about");
  });

  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 7000;
  }
  app.listen(port);


app.listen(port,function(){

    console.log("server has started on port successfully");
});