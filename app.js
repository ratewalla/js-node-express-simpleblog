
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
var _ = require('lodash');
const mongoose = require('mongoose');

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


// db connection string
mongoose.connect("mongodb+srv://admin-riz:xxxxxxx@cluster0.87ypz.mongodb.net/blogDB", {useNewUrlParser:true, useUnifiedTopology: true });

// schema set up
const postSchema = new mongoose.Schema({
  title: String,
  body: String
});


// create models
const Post = new mongoose.model("Posts", postSchema);





app.get('/', (req, res) => {

  Post.find({}, (err,foundPosts)=>{
      res.render('home', {homePosts:foundPosts});
  });

});



app.get('/about', (req, res) => {
  res.render('about',{aboutText:aboutContent});
});

app.get('/post/:postId', (req, res) => {
  const id = req.params.postId;

  Post.findById({_id:id},(err, foundPosts) =>{
    if(!foundPosts){
      res.render('post',{postTitle:"There is no such post!",postBody:""});
    } else {
      res.render('post',{postTitle:foundPosts.title,postBody:foundPosts.body,postId:foundPosts._id});
  }
  });


});


app.get('/compose', (req, res) => {
  res.render('compose');
});


app.post('/compose', (req, res) => {

  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });

  if(!req.body.postTitle || !req.body.postBody){
    res.send('Please enter a title');
  } else {
    post.save();
    res.redirect('/');
  }


});


app.get('/contact', (req, res) => {
  res.render('contact',{contactText:contactContent});
});


app.post('/delete', (req, res) => {
  const postId = req.body.delete;
  
  Post.findByIdAndRemove({_id:postId},(err)=>{
    if(err){
      console.log(err);
      res.send('Something went wrong, please try again.');
    } else{
      console.log('Deleted successfully post.');
      res.redirect('/');
    }
  })
  
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});