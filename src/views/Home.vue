<template>
<section>
  <div v-if="!isLoggedIn">
    <Login />
  </div>
  <div v-if="isLoggedIn">
    <Admin />
  </div>
  
</section>
</template>

<script>
import Login from '../components/Login';
import Admin from '../components/Admin';
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Login,
    Admin
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "user/getUserStatus",
      user: "user/getUser"
    })
  },
   methods: {
    ...mapActions({

    })
   }
};
</script>
