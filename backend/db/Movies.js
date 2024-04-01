const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const moviesSchema=new Schema({
    title:{type:String,required:true},
    director:{type:String,required:true},
    genre:{type:String,required:true},
    releaseYear:{type:Number,required:true},
    description:{type:String},
    rateAndReviews: [{
        _id: { type: Schema.Types.ObjectId, auto: true },
        rating: { type: Number },
        reviews: { type: String },
        userId:{type: Schema.Types.ObjectId}
    }]
 
});

module.exports=mongoose.model('movies',moviesSchema);