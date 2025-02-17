exports.landingPage = (req, res) => {
  res.render('index', {pageTitle: "Welcome"});
}

exports.signupGet = (req, res) => {
  res.render('signup', {pageTitle: "Register"});
}

exports.signinGet = (req, res) => {
  res.render('signin', {pageTitle: "Login"});
}

exports.dashboardGet = (req, res) => {
  res.render('dashboard', {pageTitle: "Dashboard"});
}

exports.inventoryGet = (req, res) => {
  res.render('inventory', {pageTitle: "Inventory"});
}