<template>
    <div class="App">
                <h3>Log into your account!</h3>
                {{message}}
                <form @submit="handleSubmit">
                Email: <input type='text' name='email' v-model="email" /> <br />
                Password: <input type='password' name='password' v-model="password" /> <br />
                <input type='submit' value='Log In!' />
                </form>
                <button @click="toggleLogin">SignUp instead!</button>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Login',
    data(){
        return{
            email: '',
            password: '',
            message: ''
        }
    },
    props:["liftToken", "toggleLogin"],
    methods: {
        handleSubmit(e){
        var url = 'http://localhost:5000/auth'
        e.preventDefault()
        axios.post(`${url}/login`, {
            email: this.email,
            password: this.password
        }).then( response => {
            if (response.data.type === 'error') {
                this.message = response.data.message
            } else {
                localStorage.setItem('mernToken', response.data.token)
                this.liftToken(response.data)
            }
        }).catch( () => {
            //This block catches rate limiter errors
        })
    }
    }
}
</script>