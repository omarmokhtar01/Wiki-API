const express=require("express")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose")

const app=express()
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
  title:String,
  content:String
};
const Article=mongoose.model("Article",articleSchema);

///////////Request target all Artichiles///////////////////
app.route("/articles")

.get(function (req,res) {
  //Get all
Article.find({},function (err,result) {
  if (!err) {
  res.send(result);
}else {res.send(err);}
});
})

.post(function (req,res) {
//POST a New
const newArticle = new Article({
  title:req.body.title
  ,content:req.body.content
})
newArticle.save(function(err){
  if (!err) {
    res.send("Succeful baby");
  }else {
    res.send("Faluse !!!!!!!!!!")
  }
});
})

.delete(function(req,res){
  Article.deleteMany({},function(err){ //no must types {}
    if (err) {
      res.send(err);
    }else {
      res.send("Succeful");
    }
  })
});
///////////Request target specific Artichiles///////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){

  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set:{title: req.body.title, content: req.body.content}},
    {new: true},
    function(err){
      if(!err){
        res.send("Successfully updated set.");
      }
    }
  );
})

.patch(function(req, res){
Article.updateOne({title: req.params.articleTitle},{$set:req.body},function(err){
if (!err) {
  res.send("No Have Error and Succeful");
}

})
})

.delete(function(req, res){
Article.deleteOne({title: req.params.articleTitle},{$set:req.body},function(err){
if (!err) {
  res.send("Done Deleted");
}

})
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
