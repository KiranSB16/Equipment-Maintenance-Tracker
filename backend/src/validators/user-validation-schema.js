export const userRegisterSchema = {
    name:{
        exists:{
            errorMessage: 'name field is required'
        },
        notEmpty:{
            errorMessage:'name field cannot be empty'
        },
        trim:true
    },

    email : {
        exists : {
            errorMessage : 'email field is required'
        },
        notEmpty : {
            errorMessage : 'email cannot be empty'
        },
        isEmail : {
            errorMessage : 'email should be valid format'
        },
        trim : true,
        normalizeEmail : true,
        // custom : {
        //     options : async function(value){
        //         try{
        //             const user = await User.findOne({email : value})
        //             if(user){
        //                 throw new Error('Email is already taken')
        //             }
        //         }
        //         catch(err){
        //             throw new Error(err.message)
        //         }
        //         return true
        //     }

        // }
    },

    password : {
        exists : {
            errorMessage : 'password field is required'
        },
        notEmpty : {
            errorMessage : 'password cannot be empty'
        },
        isStrongPassword : {
            options : {
                minLength : 8,
                minUppercase : 1,
                minLowercase : 1,
                minNumber : 1,
                minSymbol : 1
            },
            errorMessage : 'password must contain one lowercase ,one uppercase ,one number and one symbol and it must be minimum 8 characters long'
        },
        trim : true
    },
    role:{
        exists:{
            errorMessage: "role field is required"
        },
        notEmpty:{
            errorMessage: "role cannot be empty"
         },
        isIn:{
            options: [["Technician", "Supervisor", "Manager"]],
            errorMessage: "role must be one of: Technician, Supervisor, Manager",
        },
        trim: true,
  },
}

export const userLoginSchema = {
    email : {
        exists : {
            errorMessage : 'email field is required'
        },
        notEmpty : {
            errorMessage : 'email cannot be empty'
        },
        isEmail : {
            errorMessage : 'email should be valid format'
        },
        trim : true,
        normalizeEmail : true
    },

    password : {
        exists : {
            errorMessage : 'password field is required'
        },
        notEmpty : {
            errorMessage : 'password cannot be empty'
        },
        isStrongPassword : {
            options : {
                minLength : 8,
                minUppercase : 1,
                minLowercase : 1,
                minNumber : 1,
                minSymbol : 1
            },
            errorMessage : 'password must contain one lowercase ,one uppercase ,one number and one symbol and it must be minimum 8 characters long'
        },
        trim : true
    }

}