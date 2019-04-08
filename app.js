const express = require('express');
//const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser=require('body-parser');
const Nexmo=require('nexmo');
const app = express();
var http=require('http');
var server = http.createServer(app);
var io= require('socket.io').listen(server);

// Passport Config
require('./config/passport')(passport);

app.use(express.static(__dirname));

//body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// DB Con
mongoose.connect('mongodb+srv://asr_123:anurag@123@cluster0-nyfnu.mongodb.net/test1?retryWrites=true',{ useNewUrlParser: true });

let db =mongoose.connection;
app.get('/',(req,res)=>{
res.render('welcome');
});


db.once('open',function(){

  console.log('connected to mongodb'); 

});



db.on('error',function(err){

  console.log(err);

});
// EJS
//app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// question
 const Question = require('./models/question1');
app.post('/question',function(req,res){
  let item=new Question();
  item.title= req.body.title;
  item.subject=req.body.subject;
  item.userq=req.user.name;

  //item.dateq="22";
  //item.dateq=dateq;
  //console.log(item.dateq);
  //item.answer=[];
  //item.subject=req.body.subject;
  //item.name=req.user.name;
  //console.log("asr1");
  item
        .save()
        .then(item => {
                res.redirect('/home');
              })
              .catch(err => console.log(err));

});

app.get('/question1',function(req,res){
	let items=Question.find({},(err,items)=>{
			//let items=User1.find({},(err,items)=>{
				//console.log("asr2");
		if(err){
			console.log(err);
			return;
		}
		res.send(items);
	});
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

//show details of question
app.get('/question2/:id', (req, res) => {

	//let items=User1.find({title:'APNI KHETI'},(err,items)=>{
		//console.log(req.user.name);
		var asr=req.user.name;
		let items1=Question.findById({_id:req.params.id},(err,items1)=>{
		if(err){
			console.log(err);
			return;
		}
		//console.log(items1.title);
		//console.log(items1.subject);
		res.render('questionhome',{items1:items1,asr:asr});
	})
	});
//answer of question
app.post('/answer/:id/:asr',(req,res) =>{
    
   console.log(req.params.asr);
   let items2=Question.findById({_id:req.params.id},(err,items2)=>{
   	  if(err){
   	  	console.log(err);
   	  	return;
   	  }
     //console.log(items2.datq);
     console.log(req.body.answer);
     var elem={};
     elem.usera=req.params.asr;
     elem.answera=req.body.answer;
    // elem.datea=items2.dateq;
   items2.answer.push(elem);
   //items2.answer.usera.push(req.user.name);
   let query={_id:req.params.id};
   Question.update(query,items2,function(err){
      if(err)
      {
      	console.log(err);
      	return;
      }
      else{
      	res.redirect('/question2/'+req.params.id);
      }
   });

});
});

//answer




const PORT = process.env.PORT || 6500;

server.listen(PORT, console.log(`Server started on port ${PORT}`));