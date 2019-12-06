<template>
  
  <div v-if="user" class="home">
    <p>Hello, {{user.name}}</p>
    <button @click="logOut">Log Out</button>
  </div>
  <div v-else class="home">
        <Signup v-bind:liftToken="liftToken" />
        <Login v-bind:liftToken="liftToken" />
  </div>
</template>

<script>
import axios from 'axios'
import Login from '../components/Login'
import Signup from '../components/Signup'
export default {
  name: 'Home',
  components: {
    Login,
    Signup
  },
  data(){
    return{
      token: '',
      user: null,
      errorMessage: '',
      lockedResult: ''
    }
  },
  methods:{
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
      axios.post(`/auth/me/from/token`, {token})
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

  created () {
    this.checkForLocalToken()
  },

  liftToken({token, user}) {
      this.token = token
      this.user = user
  },

  logOut(){
    localStorage.removeItem('mernToken')
    this.token = ''
    this.user = null
  }
  }
}

</script>
