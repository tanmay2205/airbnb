if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}



const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require("path")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require('./models/user.js');


const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


const dburl = process.env.ATLASDB_URL
// Connect to MongoDB
main()
.then(() => { 
  console.log("connected to db") 
})
.catch((err) => {
  console.log(err);
});
async function main() {
  await mongoose.connect(dburl);
}

// Set up EJS and views directory
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Middleware to parse URL-encoded data (for req.params)
app.use(express.urlencoded({ extended: true }))

// override with POST having ?_method=DELETE/put
app.use(methodOverride('_method'))

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

// using static files
app.use(express.static(path.join(__dirname, "/public")))


const store = MongoStore.create({
  mongoUrl: dburl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
})

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE",err);
})

//Create a session middleware with the given options
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true

  }
}





// home route
// app.get("/", async (req, res) => {
//   res.send("hello world")
// })


app.use(session(sessionOptions));

app.use(flash()); //flash should be used above the routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  // use static authenticate method of model in LocalStrategy
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser =req.user;
  next();
})

// app.get("/demouser", async(req,res) => {
//   let fakeuser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   })
//   let registeredUser= await User.register(fakeuser,"helloworld");
//   res.send(registeredUser)
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"))
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  // res.status(statusCode).send(message)
  res.status(statusCode).render("error.ejs", { message });
})


app.listen(8080, () => {
  console.log(`Example app listening on port 8080`)
})