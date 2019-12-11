<template>
    <div>
    <nav>
    <img class="logo" height="75px" width="150px" src="https://i.imgur.com/qGYzvnC.png" alt="Logo">
    <router-link class="home" to="/">Home</router-link>
    <router-link class="history" to="/history">Order History</router-link>
    <button v-bind:class='{logout: user, hidden: !user}' @click="logOut">Log Out</button>
  </nav>
        <h1>Past Orders</h1>
    <div :key="order.id" v-for="order in orders">
        <hr />
        <ul>Items</ul>
        <div :key="product.id" v-for="product in order.products">
            <li>Title: {{product.title}} | Price: {{product.price}}</li>
        </div>
        <hr />
    </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'History',
    data(){
        return{
            orders: [],
            user: null,
            token: '',
            errorMessage: ''
        }
    },
    created:function(){
    this.checkForLocalToken()
    },
    mounted:function(){
        this.getAll()
    },
    methods:{
        getAll(){
      var url = 'http://localhost:5000'
            setTimeout(()=>{ axios.get(`${url}/orders/all/${this.user._id}`)
        .then(orders => {
            this. orders= orders.data
        }) }, 500); 
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
  home(){
      this.$router.push('/')

    }
    }
}

</script>