import User from '../userModule/user.model.js'

// service for get user by email
const getUserByEmail = async(email) => {
    return await User.findOne({email});
}


export default {
    getUserByEmail
};