<template>
  <div>
  <nav>
    <img class="logo" height="100px" width="150px" src="https://i.imgur.com/V67KGTn.png" alt="Logo">
    <button class='logout' @click="logOut">Log Out</button>
  </nav>
  <div v-if="user" class="container mt-4" >
  <h3 class="App">We hope you love our Rockin Rocks. Unfortunately you can only order one of each rock at a time as it takes some time for us to make it and demand is high.</h3>
    <div class="row">
      <div class="col-md-7">
        <div class="row">
          <div class="col-md-6" :key="product.id" v-for="product in products">
            <Product
              :isInCart="isInCart(product)"
              v-on:add-to-cart="addToCart(product)"
              :product="product"
            ></Product>
          </div>
        </div>
      </div>
      <div class="col-md-5 my-5">
        <cart v-on:pay="pay()" v-on:remove-from-cart="removeFromCart($event)" :items="cart"></cart>
    </div>
  </div>
    
  </div>
  <div v-else-if="login" >

        <Login v-bind:liftToken="liftToken" v-bind:toggleLogin="toggleLogin"/>
  </div>
  <div v-else-if="!login">
        <Signup v-bind:liftToken="liftToken" v-bind:toggleLogin="toggleLogin"/>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
import Login from '../components/Login'
import Signup from '../components/Signup'
import Product from "../components/Product.vue";
import Cart from "../components/Cart.vue";

export default {
  name: 'Home',
  components: {
    Login,
    Signup,
    Product,
    Cart
  },
  data(){
    return{
      token: '',
      user: null,
      errorMessage: '',
      lockedResult: '',
      login: true,
      products:[],
      cart: []
    }
  },
  created: function(){
    this.loadProducts()
  },
  mounted: function() {
    this.checkForLocalToken()
    // this.loadProducts()
  },
  methods:{
  loadProducts(){
      var url = 'http://localhost:5000'
    axios.get(`${url}/products/all`)
    .then((products) =>{
      console.log(products.data)
      this.products = products.data
    })
  },
  checkForLocalToken(){
    //look for token in local storage
    let token = localStorage.getItem('mernToken')
    if (!token || token === 'undefined'){
      //if no token remove all evidence of mernToken from localStorage and state
      localStorage.removeItem('mernToken')
      this.token = ''
      this.user = null
    } else {
      // if we find token verify it on the backend
      var url = 'http://localhost:5000'
      axios.post(`${url}/auth/me/from/token`, {token})
      .then( response => {
        if (response.data.type === 'error'){
          // console.log('ERROR:', response.data.message)
          localStorage.removeItem('mernToken')
          this.token= ''
          this.user= null
          this.errorMessage= response.data.message
        } else {
          //if verified store it back in local storage and state
          localStorage.setItem('mernToken', response.data.token)
          this.token = response.data.token,
          this.user = response.data.user
        }
      })
    }
  },


  liftToken({token, user}) {
      this.token = token
      this.user = user
  },

  logOut(){
    localStorage.removeItem('mernToken')
    this.token = ''
    this.user = null
  },
  toggleLogin(){
    this.login = !this.login
  },
  addToCart(product) {
      console.log(product)
      this.cart.push(product);
      var url = 'http://localhost:5000'
      axios.post(`${url}/orders/addproduct`, {
        user_id: this.user._id,
        title: product.title,
        price: product.price,
        image: product.image
      })
    },
    isInCart(product) {
      var checkedProduct = this.cart.find(item => item._id === product._id);
      if (checkedProduct) {
        return true;
      }
      return false;
    },
    removeFromCart(product) {
      console.log(product)
      this.cart = this.cart.filter(item => item._id !== product._id);
    },
    pay() {
      this.cart = []

    }
  
  }
}

</script>

<style>
body {
  background-color: #dcdcdc;
}
.logout{
  margin-left: 3em;

}
.logo{
  /* padding-left: .5em; */
  border:2px whitesmoke solid;
  border-radius: 10px;
}
.title{
  text-align: center;
  margin-top: .5em;
}
nav{
  background-color: #252424e3;
}
</style>
