<template>
  <div>
  <div v-if="user">
  <nav>
    <img class="logo" height="75px" width="150px" src="https://i.imgur.com/qGYzvnC.png" alt="Logo">
    <router-link class="home" to="/">Home</router-link>
    <router-link class="history" to="/history">Order History</router-link>
    <button v-bind:class='{logout: user, hidden: !user}' @click="logOut">Log Out</button>
  </nav>
  <div class="container mt-4" >
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
  </div>
  <div v-else-if="login" >
    <nav>
    <img class="logo" height="75px" width="150px" src="https://i.imgur.com/qGYzvnC.png" alt="Logo">
    <router-link class="home" to="/">Home</router-link>
    <!-- <router-link class="history" to="/history">Order History</router-link> -->
    <button v-bind:class='{logout: user, hidden: !user}' @click="logOut">Log Out</button>
    </nav>
        <Login v-bind:liftToken="liftToken" v-bind:toggleLogin="toggleLogin"/>
  </div>
  <div v-else-if="!login">
    <nav>
    <img class="logo" height="75px" width="150px" src="https://i.imgur.com/qGYzvnC.png" alt="Logo">
    <router-link class="home" to="/">Home</router-link>
    <!-- <router-link class="history" to="/history">Order History</router-link> -->
    <button v-bind:class='{logout: user, hidden: !user}' @click="logOut">Log Out</button>
    </nav>
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
    this.checkForLocalToken()
  },
  beforeMount: function() {
    this.loadProducts()
  },
  mounted: function(){
    this.getCart()
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
        prodId: product._id,
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
      var url = 'http://localhost:5000'
      axios.get(`${url}/orders/removeitem/${this.user._id}/${product._id}`)
      .then(order => {
        console.log(product._id)
        console.log(order)
      })
    },
    pay() {
      this.$router.push('/checkout')
    },
    getCart(){
        console.log('getting cart')
      var url = 'http://localhost:5000'
        setTimeout(()=>{ axios.get(`${url}/orders/current/${this.user._id}`)
        .then(order => {
            console.log(order)
            this.cart = order.data.products
        }) }, 300); 
        
    },
    home(){
      this.$router.push('/')

    }
  
  }
}

</script>

<style>
body {
  background-color: #dcdcdc;
}
.logout{
  position: absolute;
  right: 40px;
  top: 20px;
}
.history{
  position: absolute;
  left: 250px;
  top: 12px;
  border: 2px grey outset;
  background: grey;
  color: white;
  padding: .5em
}
.home{
  position: absolute;
  left: 170px;
  top: 12px;
  border: 2px grey outset;
  background: grey;
  color: white;
  padding: .5em
}
.hidden{
  display: none;
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
  position:relative;
}
</style>
