<template>
    <div class="App">
                <h3>Create a new account</h3>
                <form @submit="handleSubmit">
                First Name: <input type='text' name='firstName' v-model="firstName" /> <br />
                Last Name: <input type='text' name='lastName' v-model="lastName" /> <br />
                Email: <input type='text' name='email' v-model="email" /> <br />
                Password: <input type='password' name='password' v-model="password" /> <br />
                Address: <input type='text' name='address' v-model="address" /> <br />
                City: <input type='test' name='city' v-model="city" /> <br />
                State: <input type='test' name='state' v-model="state" /> <br />
                ZipCode: <input type='password' name='zipcode' v-model="zipCode" /> <br />
                <input type='submit' value='Sign Up!' />
                </form>
                <button @click="toggleLogin">Login instead!</button>

    </div>
</template>

<script>
 import axios from 'axios'
export default {
   
    name: 'Signup',
    data(){
       return{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        message: ''
       }
    },
    props: ["liftToken", "toggleLogin"],
    methods:{
        handleSubmit(e){
        var url = 'http://localhost:5000'
        e.preventDefault()
        axios.post(`${url}/auth/signup`, {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            address: this.address,
            city: this.city,
            state: this.state,
            zipCode: this.zipCode,
            admin: false
        }).then( response => {
            console.log(response)
            if (response.data.type === 'error') {
                this.message = response.data.message
            } else {
                localStorage.setItem('mernToken', response.data.token)
                this.liftToken(response.data)
                console.log('user created yooooooooo')
            }
        }).catch( (err) => {
            console.log(err)
        })
    }
    }
}
</script>