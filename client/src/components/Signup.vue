<template>
    <div className="Signup">
                <h3>Create a new account</h3>
                <form @submit="handleSubmit">
                Name: <input type='text' name='name' v-model="name" /> <br />
                Email: <input type='text' name='email' v-model="email" /> <br />
                Password: <input type='password' name='password' v-model="password" /> <br />
                <input type='submit' value='Sign Up!' />
                </form>
    </div>
</template>

<script>
 import axios from 'axios'
export default {
   
    name: 'Signup',
    data(){
       return{
        name: '',
        email: '',
        password: '',
        message: ''
       }
    },
    props: ["liftToken"],
    methods:{
        handleSubmit(e){
        var url = 'http://localhost:5000'
        e.preventDefault()
        axios.post(`${url}/auth/signup`, {
            name: this.name,
            email: this.email,
            password: this.password
        }).then( response => {
            console.log(response)
            if (response.data.type === 'error') {
                this.message = response.data.message
            } else {
                localStorage.setItem('mernToken', response.data.token)
                this.liftToken(response.data)
            }
        }).catch( () => {
            
        })
    }
    }
}
</script>