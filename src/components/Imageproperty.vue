<template>
 <div>
     
<v-img
      :src="image"
      :lazy-src="image"
      aspect-ratio="1"
      class="grey lighten-2"
      :max-width="width"
      :max-height="100"
    ></v-img>

     </div>
</template>

<script>



export default {
  props: ['images', 'width', 'height'],
  data: () => ({
    
  }),
  computed: {
    randomNum(){
        return Math.floor((Math.random() * 999) + 1)
    },
    image() {
      return `${this.images[0]}?random=${this.randomNum}`
    }
  },
};
</script>
