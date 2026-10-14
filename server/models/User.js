
import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword:{
    type: String,
    required: true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    role:{
        type: String,
         enum:["admin", "user"],
    default: "user"
    } 
   
},
{
    timeStamps: true
}



)


const UserModel = mongoose.model("UserSchema", UserSchema);
export default UserModel;

