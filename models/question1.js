const mongoose = require('mongoose');

const QuestionSchema1 = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  answer: [
  {
   usera:{type:String,required:false},
    answera:{type:String,required:false},
    datea:{type:Date,default:Date.now}
  }
 ],
  userq: {
     type:String,
     required:true
   },
   dateq: {
     type: Date,
    default: Date.now
   }
});
const Question1 = mongoose.model('Question1', QuestionSchema1);
module.exports = Question1;