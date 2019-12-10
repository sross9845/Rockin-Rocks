<template>
    <div>
    <nav>
        <img class="logo" height="100px" width="150px" src="https://i.imgur.com/V67KGTn.png" alt="Logo">
        <button class='logout' @click="logOut">Log Out</button>
    </nav>
    <h1 class="title">Checkout</h1>
    <div v-if="user" class="container mt-4" >
    <div class="row">
    <div class="col-md-5 my-5">
        <CheckoutCart v-on:remove-from-cart="removeFromCart($event)" :items="cart"/>
    </div>
    <div class="col-md-5 my-5">
        <Payment v-bind:finish="finish" v-bind:user='user'/>
    </div>
    </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios'
import CheckoutCart from '../components/CheckoutCart'
import Payment from '../components/Payment'
export default {
name:'Checkout',
components:{
    CheckoutCart,
    Payment
},
data(){
    return{
        user:null,
        token: '',
        errorMessage:'',
        cart: []
    }
},
created:function(){
    this.checkForLocalToken()
},
mounted:function(){
    this.getCart()
},
methods:{
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
    getCart(){
        console.log('getting cart')
      var url = 'http://localhost:5000'
        setTimeout(()=>{ axios.get(`${url}/orders/current/${this.user._id}`)
        .then(order => {
            console.log(order)
            this.cart = order.data.products
        }) }, 300); 
        
    },
    checkForLocalToken(){
        console.log('checking')
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
            console.log('user added')
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
    this.$router.push('/')

  },
  finish(){
      axios.put('/orders/submit',{
          products: [],
          completed: true
      }).then(() => {
          setTimeout(()=>{ 
                this.$router.push('/success')
            }, 3000); 
      })
  }
}
}
</script>