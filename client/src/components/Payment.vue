<template>
<div>
    <div class='container pay'>
        <div class='columns'>           
                <div class="field">
                    <label for="card_number">Card Number</label>
                    <input id="card_number" v-model="card.number" type="text" :class="['is-danger' ? cardNumberError : '', 'input']" placeholder='4242424242424242'>
                    <span class="help is-danger" v-show="cardNumberError">
                        {{ cardNumberError }}
                    </span>
                </div>

                <div class="field">
                    <label for="cvc">CVC</label>
                    <input id="cvc" v-model="card.cvc" type="text" class="input" placeholder='123'>
                    <span class="help is-danger" v-show="cardCvcError">
                        {{ cardCvcError }}
                    </span>
                </div>

                <div class="field">
                    <label for="exp_month">Expiry Month</label>
                    
                    <input id="exp_month" v-model="card.exp_month" type="text" :class="['is-danger' ? cardMonthError : '', 'input']" placeholder="MM">
                    <span class="help is-danger" v-show="cardMonthError">
                        {{ cardMonthError }}
                    </span>
                </div>

                <div class="field">
                    <label for="exp_month">Expiry Year</label>
                    <input id="exp_year" v-model="card.exp_year" type="text" :class="['is-danger' ? cardYearError : '', 'input']" placeholder="YY">
                    <span class="help is-danger" v-show="cardYearError">
                        {{ cardYearError }}
                    </span>
                </div>
                    
                <div class="help is-danger" v-if="cardCheckError">
                    <span>{{ cardCheckErrorMessage }}</span>
                </div> 
            </div>
            <div class='column is-4'>         
                <div class="field">
                    <label>Address</label>
                    <input type='text' class='input' v-model='address.street' placeholder='123 Fake St #303'>
                </div>
                <div class="field">
                    <label>City</label>
                    <input type='text' class='input' v-model='address.city' placeholder='San Francisco'>
                </div>
                <div class="field">
                <label>State</label>
                    <input type='text' class='input' v-model='address.state' placeholder='CA'>
                </div>
                <div class="field">
                    <label>Zip</label>
                    <input type='text' class='input' v-model='address.zip' placeholder='94607'>
                </div>
            </div>
        </div>
        <br />
        <div class="columns">
            <div class='column is-12'>
                <button type="submit" class="button is-primary is-large is-pulled-right" @click.prevent="validate" :disabled="cardCheckSending">
                    <span v-if="cardCheckSending">
                        <i class="fa fa-btn fa-spinner fa-spin"></i> 
                        Ordering...
                    </span>
                    <span v-else>
                        Place Order
                    </span>
                </button>
            </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    props: ['user', 'finish'],
    data(){
        return {
            stripeKey: 'pk_test_Tro4UIRJbdwS1mR7qO8EQ73F',
            // fields
            address: {
                street: this.user.address ,
                city: this.user.city,
                state: this.user.state,
                zip: this.user.zipCode
            },
            card: {
                number: '4242424242424242',
                cvc: '123',
                exp_month: '01',
                exp_year: '20'
            },
            // validation
            cardNumberError: null,
            cardCvcError: null,
            cardMonthError: null,
            cardYearError: null,
            cardCheckSending: false,
            cardCheckError: false,
            cardCheckErrorMessage: ''
        }
    },
    methods: {
        validate(){
            this.clearCardErrors();
            let valid = true;
            if(!this.card.number){ valid = false; this.cardNumberError = "Card Number is Required"; }
            if(!this.card.cvc){ valid = false; this.cardCvcError = "CVC is Required"; }
            if(!this.card.exp_month){ valid = false; this.cardMonthError = "Month is Required"; }
            if(!this.card.exp_year){ valid = false; this.cardYearError = "Year is Required"; }
            if(valid){
            this.createToken();
            setTimeout(()=>{ 
                this.$router.push('/success')
            }, 1000); 
            }
        },
        clearCardErrors(){
            this.cardNumberError = null;
            this.cardCvcError = null;
            this.cardMonthError = null;
            this.cardYearError = null;
        },
        createToken() {
            this.cardCheckError = false;
            window.Stripe.setPublishableKey(this.stripeKey);
            window.Stripe.createToken(this.card, this.stripeResponseHandler, this);
            this.cardCheckSending = true;
        },
        stripeResponseHandler(status, response) {
            this.cardCheckSending = false;
            if (response.error) {
                this.cardCheckErrorMessage = response.error.message;
                this.cardCheckError = true;
                console.error(response.error);
            } else {
                // this.tokenRetrieved = true;
                // this.$emit('paymentEntered', response.id);
                // token to create a charge on our server 
                var token_from_stripe = response.id;
                var request = {
                    name: this.name,
                    email: this.email,
                    engravingText: this.engravingText,
                    address: this.address,
                    card: this.card,
                    token_from_stripe: token_from_stripe
                };
                // Send to our server
                axios.post(`${window.endpoint}/charge`, request)
                    .then((res) => {
                        var error = res.data.error;
                        var charge = res.data.charge;
                        if (error){
                            console.error(error);
                        } else {
                            this.$router.push({ path: `order-complete/${charge.id}` })
                        }
                    });
            }
        }
    }
}
</script>

<style>
.pay{
    border: 5px grey outset;
    padding: 1em
}
/* h2 { text-decoration: underline; }
.textarea:not([rows]) { max-height: 110px; min-height: 110px; }
.container { margin-bottom: 30px; }
.column > img { margin-top: 60px; }
.button-field { display: flex; justify-content: center; }
#left-line { margin-top:27px; } */
</style>