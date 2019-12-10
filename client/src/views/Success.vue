<template>
    <h1>Thank you for ordering from Rockin Rocks. You will now be redirected to your home page</h1>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            user: null,
            token: '',
            errorMessage: ''
        }
    },
    created:function(){
        this.checkForLocalToken()
    },
    beforeMount:function(){
        this.redirect()

    },
    mounted:function(){
        this.done()

    },
    methods: {
    done(){
      
      var url = 'http://localhost:5000'
      setTimeout(()=> {
          console.log('done')
          axios.put(`${url}/orders/submit/${this.user._id}`,{
            completed: true
          })
      },4000)
    },
    redirect(){
        setTimeout(()=>{ 
                this.$router.push('/')
            }, 5000); 
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
            console.log('User created')
          //if verified store it back in local storage and state
          localStorage.setItem('mernToken', response.data.token)
          this.token = response.data.token,
          this.user = response.data.user
        }
      })
    }
  }
}
}

</script>