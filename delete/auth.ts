// import mongoose from "mongoose";
// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import User from "../_models/User";
// import dbConnect from "./db";
// import { getUser } from "./data-service";

// export const {
//   auth,
//   signIn,
//   signOut,
//   handlers: { GET, POST },
// } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET,
//     }),
//   ],
//   callbacks: {
//     authorized({ auth, request }) {
//       return !!auth?.user;
//     },
//     async signIn({ user, account, profile }) {
//       await dbConnect();
//       // console.log("user", user);
//       // console.log("account", account);
//       // console.log("profile", profile);

//       try {
//         const existingUser = await User.findOne({ email: user.email });
//         // console.log("existingUser", existingUser);

//         if (!existingUser)
//           await User.create({ name: user.name, email: user.email });

//         return true;
//       } catch (err) {
//         console.log("there was an error during signup");
//         return false;
//       }
//     },
//     async session({ session, user }) {
//       try {
//         await dbConnect();
//         const userInfo = await getUser(session.user.email);
//         console.log("userInfo", userInfo);

//         // we add the id of the created user to the session
//         session.user.userId = userInfo._id;

//         return session;
//       } catch (error) {
//         console.log("error in session", error);
//         return session;
//       }
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
// });

// // we want our application to know the guest that has been signed in. by checking the database whether the guest exist if not we create a new guest
// // we do that using the signIn callback.
// // if everything goes well in the signIn callback we return true, if some error happens in the findOne method we move to the catch block and return false so the user wont be logged in.

// // authorized returns true or false, true means the user is authorizes to go through the protected route
// //  next auth is going to call the authorized function when the user accesses the '/account route
