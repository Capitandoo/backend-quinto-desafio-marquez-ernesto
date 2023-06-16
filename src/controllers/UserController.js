import { registroService, loginService } from "../services/UserService.js";
import {
    getCartService,
    createCartService,
    addProductToCartService,
    deleteProductToCartService,
    deleteAllProductToCartService,
    updateProductToCartService,
    updateProductQuantityService
  } from "../services/CartsService.js";

export const registroController = async (req, res, next) => {
    try {
        const newUser = await registroService (req.body)
        if(newUser) {
            res.redirect('/login')
        } else {
            res.redirect('/error-registro')
        }
    } catch (error) {
        console.log (error);
    }
}

export const loginController = async (req, res, next) => {
    try {
        const userData = req.body
        const validate = await loginService (userData)
        if(!validate){
            res.status(404).redirect('/error-login')
        } else {
            const cartId = req.session.cid
            if(!cartId){
                const createCart = await createCartService ();
                req.session.cartId = createCart._id
                req.session.userData = validate
            }
        res.status(304).redirect('/productos');
        }       
    } catch (error) {
        console.log (error);
    }
}

export const logoutController = async (req, res, next) => {
    try {
        req.session.destroy ((err) => {
            if (err) {
                console.log (err);
            } else {
                res.redirect ("/login");
            }
        })
    } catch (error) {
        console.log (error);
    }
}
