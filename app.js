const express = require("express");
const bodyParser = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/crudDemo");

const itemsSchema = {
  _id: Number,
  serialNum: Number,
  name: String,
  number: Number,
  emailID: String,
};

const Item = mongoose.model("Item", itemsSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    res.render("crud", { listItems: foundItems });
  });
});

app.post("/", function (req, res) {
  var idNum = parseInt(req.body.idNum);
  var serialNum = parseInt(req.body.serialNum);
  var name = req.body.name;
  var number = parseInt(req.body.number);
  var emailID = req.body.emailID;

  const item = new Item({
    _id: idNum,
    serialNum: serialNum,
    name: name,
    number: number,
    emailID: emailID,
  });

  item.save();

  res.redirect("/");
});

app.post("/editDelete", function (req, res) {
  const itemID = req.body.itemID;
  const button = req.body.button;

  var newName = req.body.newName;
  var newNumber = req.body.newNumber;
  var newEmailID = req.body.newEmailID;

  if (button === "delete") {
    Item.findByIdAndRemove(itemID, function (err) {
      console.log("item deleted");
      res.redirect("/");
    });
    console.log("delete");
  } else if (button === "edit") {
    Item.findByIdAndUpdate(
      itemID,
      { $set: { name: newName, number: newNumber, emailID: newEmailID } },
      function (err) {
        console.log("updated");
        res.redirect("/");
      }
    );
  }
});

app.post("/edit", function (req, res) {});

app.listen(3000, function () {
  console.log("server started on PORT: 3000");
});
