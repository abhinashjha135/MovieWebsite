// const mongoose=require('mongoose');
// // mongoose.connect("mongodb+srv://abhinashjha135:EkhqzK0Qp9WFLpNX@backendecommercd.urwvqk7.mongodb.net/
// // mongodb://localhost:27017backendEcommercd?retryWrites=true&w=majority");
// mongoose.connect("mongodb://localhost:27017/e-commerce");
const mongoose=require('mongoose');

function connectDB(){
   
      mongoose.connect("mongodb+srv://abhinashjha135:dl35bw3598@movies.5uqhfng.mongodb.net/Movie?retryWrites=true&w=majority&appName=Movies",{
        useNewUrlParser:true,
        // useCreateIndex:true,
        useUnifiedTopology:true,
        // useFindAndModify:truemov
    })
   
    const connection=mongoose.connection;
    connection.on('error', (err) => {
        
        console.error('MongoDB connection error:', err);
    });

    connection.once('open', () => {
        console.log('MongoDB connected successfully deployed');
    });

   
    
}
module.exports=connectDB;
