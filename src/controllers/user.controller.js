import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
export const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation -not empty
    //check if user already exists :username,email
    //check for images ,check for avatar
    //upload them to cloudinary,avatar checking
    //create user object -create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res

    const { username, email, fullname, password } = req.body
    console.log('email : ', email)
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "") //this is production based technique to showcase error
        //store the details in array and call some method and use call back then check with trim === "" if its is null then showcase the error given below
    ) {
        throw new ApiError(400, "All field required")
    }

    //check user already exist
    const existedUser = User.findOne({
        $or: [{ username }, { email }],
    })

    if (existedUser) {
        throw new ApiError(409, "User  already exist!!")
    }


    //check for image and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is  required")
    }

    //upload cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "avatar is empty!")
    }

    //database entry
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    //send response
    
    return  res.status(201).json(
        new  ApiResponse(200,createdUser,"User registered successfully")
    )
})

