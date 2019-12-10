<template>
    <div class="card my-5" style="width: 18rem;">
        <img v-bind:src=product.image style="height: 10rem;" class="card-img-top" alt="A rock yo">
        <div class="card-body">
            <h5 class="text-center card-title">{{product.title}}</h5>
            <p class="text-center text-muted card-text display-5">{{product.description}}<br /> ${{Number(product.price).toFixed()}}</p>
            <button :disabled="isInCart" @click="$emit('add-to-cart',product)" class="btn btn-info form-control">
                {{isInCart ? 'Added to cart': 'Add to Cart'}}
            </button>
        </div>
    </div>
</template>

<script>

export default{
    props: ['product','isInCart'],
}
</script>