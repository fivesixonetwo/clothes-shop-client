import {getProfileFailed, getProfileSuccess, loginFailure, loginStart, loginSuccess} from "./userRedux";
import {privateRequest, publicRequest} from "../helpers/axiosInstance";
import {addError, addSuccess} from "./alertRedux";
import {addNew, editQuantity, remove} from "./cartRedux";

export const login = (user) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await publicRequest.post("/auth/login", user);
        dispatch(loginSuccess(response.data));
        return response;
    } catch (error) {
        dispatch(loginFailure());
        handleApiError(dispatch, error);
    }
};

export const register = (user) => async (dispatch) => {
    try {
        const response = await publicRequest.post("/auth/sign-up", user);
        handleApiSuccess(dispatch, "Successfully register new account!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to register account!");
    }
}

export const getProfile = () => async (dispatch) => {
    try {
        const response = await privateRequest.get("/users/profile");
        dispatch(getProfileSuccess(response.data));
    } catch (error) {
        dispatch(getProfileFailed());
        handleApiError(dispatch, error, "Failed to fetch your profile!");
    }
}

export const updateProfile = (data) => async (dispatch) => {
    try {
        const response = await privateRequest.patch("/users/profile", data);
        dispatch(getProfileSuccess(response.data));
        handleApiSuccess(dispatch, "Your profile has been updated!");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to update your profile!");
    }
}

export const getShippingAddress = () => async (dispatch) => {
    try {
        return await privateRequest.get("/users/addresses");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to fetch shipping address!");
    }
}

export const addShippingAddress = (address) => async (dispatch) => {
    try {
        const response = await privateRequest.post("/users/addresses", address);
        handleApiSuccess(dispatch, "Successfully add shipping address");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to add shipping address!");
    }
}

export const updateShippingAddress = (address) => async (dispatch) => {
    try {
        const response = await privateRequest.patch("/users/addresses/" + address.id, address);
        handleApiSuccess(dispatch, "Shipping address has been updated!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to update shipping address!");
    }
}

export const deleteShippingAddress = (id) => async (dispatch) => {
    try {
        const response = await privateRequest.delete("/users/addresses/" + id);
        handleApiSuccess(dispatch, "Shipping address has been deleted!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to delete shipping address!");
    }
}

/**
 * ADMINISTRATOR
 * @param dispatch
 * @param error
 * @param defaultMessage
 */

export const getUsers = () => async (dispatch) => {
    try {
        return await privateRequest.get("/admin/users");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to get users");
    }
}

export const toggleUserStatus = (id) => async (dispatch) => {
    try {
        return await privateRequest.get("/admin/users/" + id + "/toggle-status");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to change user status");
    }
}

export const getCategories = () => async (dispatch) => {
    try {
        return await publicRequest.get("/products/categories");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to fetch categories");
    }
}

export const addCategory = (category) => async (dispatch) => {
    try {
        const response = await privateRequest.post("/admin/categories", category);
        handleApiSuccess(dispatch, "Successfully add category");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to add category!");
    }
}

export const updateCategory = (category) => async (dispatch) => {
    try {
        const response = await privateRequest.patch("/admin/categories/" + category.id, category);
        handleApiSuccess(dispatch, "Category has been updated!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to update category!");
    }
}

export const deleteCategory = (id) => async (dispatch) => {
    try {
        const response = await privateRequest.delete("/admin/categories/" + id);
        handleApiSuccess(dispatch, "Category has been deleted!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to delete category!");
    }
}

export const getAllAttributes = () => async (dispatch) => {
    try {
        return await privateRequest.get("/admin/attributes");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to get attributes");
    }
}

export const addAttribute = (name) => async (dispatch) => {
    try {
        const response = await privateRequest.post("/admin/attributes", {name});
        handleApiSuccess(dispatch, "Attribute has been added!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to add attribute");
    }
}

export const addAttributeValue = (attributeId, value) => async (dispatch) => {
    try {
        const response = await privateRequest.post("/admin/attributes/values/" + attributeId, {value});
        handleApiSuccess(dispatch, "Attribute value has been added!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to add attribute value");
    }
}

export const getProducts = () => async (dispatch) => {
    try {
        return await privateRequest.get("/admin/products");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to get products");
    }
}

export const getNewArrivals = () => async (dispatch) => {
    try {
        return await publicRequest.get("/products/new-arrivals?size=5");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to get products");
    }
}

export const filterProduct = (categories) => async (dispatch) => {
    try {
        const params = {};
        if (categories) params.categories = categories;

        return await publicRequest.get("/products/filters", {params});
    } catch (error) {
        handleApiError(dispatch, error, "Failed to filter products");
    }
}

export const getProductDetail = (id) => async (dispatch) => {
    try {
        return await publicRequest.get("/products/" + id);
    } catch (error) {
        handleApiError(dispatch, error, "Failed to get product detail");
    }
}

export const addProduct = (product) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append('thumbnail', product.thumbnail.fileList[0].originFileObj);
        if (product['galleries'] && product['galleries'].fileList) {
            [].concat(product['galleries'].fileList).forEach(img => {
                formData.append('galleries', img.originFileObj);
            });
        }
        delete product.thumbnail;
        delete product.galleries;

        formData.append("product", JSON.stringify(product));
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const response = await privateRequest.post("/admin/products", formData, config);
        handleApiSuccess(dispatch, "Successfully add new product");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to add product!");
    }
}

export const updateProduct = (id, product) => async (dispatch) => {
    try {
        const formData = new FormData();
        if (product.thumbnail) {
            formData.append('thumbnail', product.thumbnail.fileList[0].originFileObj);
        }
        if (product['galleries']) {
            if (Array.isArray(product['galleries'])) {
                product.updateGalleries = false;
            } else if (typeof product['galleries'] === 'object') {
                product.updateGalleries = true;
                product.deletedGalleries = product.removedGalleries || [];
                if (product['galleries'].fileList.length) {
                    const newImg = product['galleries'].fileList.filter(i => !i.existed);
                    newImg.forEach(img => {
                        formData.append('galleries', img.originFileObj);
                    });
                }
            }
        }
        delete product.thumbnail;
        delete product.galleries;

        formData.append("product", JSON.stringify(product));
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const response = await privateRequest.patch("/admin/products/" + id, formData, config);
        handleApiSuccess(dispatch, "Successfully update product");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to update product!");
    }
}

export const addProductVariant = (variant) => async (dispatch) => {
    try {
        const formData = new FormData();
        if (variant['galleries'] && variant['galleries'].fileList) {
            [].concat(variant['galleries'].fileList).forEach(img => {
                formData.append('galleries', img.originFileObj);
            });
        }
        delete variant.galleries;

        formData.append("variant", JSON.stringify(variant));
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const response = await privateRequest.post("/admin/products/variants", formData, config);
        handleApiSuccess(dispatch, "Successfully add new product variant");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to add product variant!");
    }
}

export const updateProductVariant = (id, variant) => async (dispatch) => {
    try {
        const formData = new FormData();
        if (variant['galleries']) {
            if (Array.isArray(variant['galleries'])) {
                variant.updateGalleries = false;
            } else if (typeof variant['galleries'] === 'object') {
                variant.updateGalleries = true;
                variant.deletedGalleries = variant.deletedGalleries || [];
                if (variant['galleries'].fileList.length) {
                    const newImg = variant['galleries'].fileList.filter(i => !i.existed);
                    newImg.forEach(img => {
                        formData.append('galleries', img.originFileObj);
                    });
                }
            }
        }
        delete variant.galleries;

        formData.append("variant", JSON.stringify(variant));
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const response = await privateRequest.patch("/admin/products/variants/" + id, formData, config);
        handleApiSuccess(dispatch, "Successfully update product variant");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to update product variant!");
    }
}

export const deleteProductVariant = (id) => async (dispatch) => {
    try {
        const response = await privateRequest.delete("/admin/products/variants/" + id);
        handleApiSuccess(dispatch, "Variant has been deleted!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to delete variant!");
    }
}

export const deleteProduct = (id) => async (dispatch) => {
    try {
        const response = await privateRequest.delete("/admin/products/" + id);
        handleApiSuccess(dispatch, "Product has been deleted!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to delete category!");
    }
}


export const publishProduct = (id) => async (dispatch) => {
    try {
        const response = await privateRequest.get("/admin/products/" + id + "/publish");
        handleApiSuccess(dispatch, "Product has been published!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to published product!");
    }
}

export const getAllOrder = () => async (dispatch) => {
    try {
        return await privateRequest.get("/admin/orders");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to fetch orders!");
    }
}

export const changeOrderStatus = (id, status) => async (dispatch) => {
    try {
        const response = await privateRequest.patch("/admin/orders/" + id + `/${status}`);
        handleApiSuccess(dispatch, "Order has been change to " + status);
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to change status!");
    }
}

/**
 * Carts
 * @param item
 * @returns {(function(*): Promise<void>)|*}
 */

export const addItemToCart = (item) => async (dispatch) => {
    dispatch(addNew(item));
    dispatch(addSuccess({message: "Product added to cart!", timestamp: new Date().getTime()}));
}

export const removeCartItem = (item) => async (dispatch) => {
    dispatch(remove(item));
    dispatch(addSuccess({message: "Product removed from cart!", timestamp: new Date().getTime()}));
}

export const updateCartItem = (quantity, item) => async (dispatch) => {
    dispatch(editQuantity({old: item, quantity}));
    dispatch(addSuccess({message: "Cart has been updated!", timestamp: new Date().getTime()}));
}

/**
 * Wishlist
 * @returns {(function(*): Promise<void>)|*}
 * @param product
 */
export const addItem2Wishlist = (product) => async (dispatch) => {
    try {
        const response = await privateRequest.get("/users/products/" + product.id + "/favorite");
        handleApiSuccess(dispatch, "Add item to wishlist");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to add item to wishlist!");
    }
}

export const removeWishlistItem = (id) => async (dispatch) => {
    try {
        const response = await privateRequest.delete("/users/products/" + id + "/favorite");
        handleApiSuccess(dispatch, "Remove item from wishlist");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to remove item from wishlist!");
    }
}

/**
 * ORDERS
 * @param order
 * @returns {(function(*): Promise<AxiosResponse<any>|undefined>)|*}
 */
export const placeOrder = (order) => async (dispatch) => {
    try {
        const response = await privateRequest.post("/orders/place", order);
        handleApiSuccess(dispatch, "Order has been placed successfully!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to place your order!");
    }
}

export const getMyOrders = () => async (dispatch) => {
    try {
        return await privateRequest.get("/orders");
    } catch (error) {
        handleApiError(dispatch, error, "Failed to get your order!");
    }
}

export const cancelOrder = (id) => async (dispatch) => {
    try {
        const response = await privateRequest.patch("/orders/" + id);
        handleApiSuccess(dispatch, "Order has been cancelled successfully!");
        return response;
    } catch (error) {
        handleApiError(dispatch, error, "Failed to cancel your order!");
    }
}

/**
 * API handler
 * @param dispatch
 * @param message
 */

const handleApiSuccess = (dispatch, message) => {
    dispatch(addSuccess({message: message, timestamp: new Date().getTime()}));
}

const handleApiError = (dispatch, error, defaultMessage) => {
    if (!error.response) {
        dispatch(addError({message: "Server is busy, try again later!", timestamp: new Date().getTime()}));
    } else if (error && error.response && error.response.data) {
        dispatch(addError(error.response.data));
    } else if (defaultMessage) {
        dispatch(addError({message: defaultMessage, timestamp: new Date().getTime()}));
    } else {
        dispatch(addError({message: "Server is busy, try again later!", timestamp: new Date().getTime()}));
    }
};
