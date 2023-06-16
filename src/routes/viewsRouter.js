import { Router } from "express";
import ProductManager from "../daos/filesystem/ProductDao.js";
import CartDao from "../daos/mongodb/CartDao.js";
import UserManager from "../daos/mongodb/UserDao.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { validateLogin } from "../middlewares/validateLogin.js";

const router = Router ();
const productManager = new ProductManager();
const cartDao = new CartDao ();

router.get ("/", async (req, res) => {
  const allProducts = await productManager.getProducts();
  res.render("home", {
    productos: allProducts,
  });
});

router.get ("/realtimeproducts", async (req, res) => {
  res.render ("realtimeproducts");
});

router.get("/login", async (req, res) => {
  res.render("login", {
    title: "Login",
    style: "home",
    logued: false,
  });
});

router.get("/registro", async (req, res) => {
  res.render("registro", {
    title: "Registro",
    style: "home",
    logued: false,
  });
});

router.get("/perfil", async (req, res) => {
  res.render ("perfil");
});

router.get("/products", async (request, response) => {
  const { limit, sort, page, query } = request.query;
  const { docs, ...pag } = await productManager.getProducts(
    parseInt(limit),
    page,
    query,
    sort
  );
  let urlParams = `?`;
  if (query) urlParams += `query=${query}&`;
  if (limit) urlParams += `limit=${limit}&`;
  if (sort) urlParams += `sort=${sort}&`;
  pag.prevLink = pag.hasPrevPage ? `${urlParams}page=${pag.prevPage}` : null;
  pag.nextLink = pag.hasNextPage ? `${urlParams}page=${pag.nextPage}` : null;
  response.render("products", {
    error: docs === undefined,
    products: docs,
    pag,
    title: "Products",
    style: "home",
    sort,
    query,
    user: { email: request.session.email, rol: request.session.rol, name: request.session.name },
    logued: true,
  });
});

router.get("/product/:pid", async (request, response) => {
  let { pid } = request.params;
  let product = await productManager.getProductById(pid);
  let error = product?.error ? true : false;
  response.render("productdetail", {
    error,
    product,
    title: `Product ${product.title}`,
    style: "home",
    logued: true,
  });
});

router.get("/newproduct", async (request, response) => {
  response.render("newproduct", {
    title: "Products",
    style: "home",
    logued: true,
  });
});

router.get("/carts/:cid", async (request, response) => {
  let { cid } = request.params;
  let { products, _id } = await cartDao.getCart(cid);
  response.render("carts", {
    title: "Products",
    style: "home",
    products,
    _id,
    logued: true,
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.redirect("/login");
    else
      res.render("user/perfil", {
        title: "Registro",
        style: "home",
        user,
        logued: true,
        error: { message: err, status: true },
      });
  });
});

router.get('/error-registro',(req,res)=>{
  res.render('errorRegistro')
})

router.get('/error-login',(req,res)=>{
  res.render('errorLogin')
})


export default router;
