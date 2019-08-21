<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Zoopla</span>
        <span class="font-weight-light"> Management</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="logout()"
        v-if="isLoggedIn"
      >
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <v-content>
  <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

import netlifyIdentity from "netlify-identity-widget";
import { mapGetters, mapActions } from "vuex";


netlifyIdentity.init({
  APIUrl: process.env.VUE_APP_IDENTITY_URL,
  logo: false 
});

export default {
  name: 'App',
  components: {

  },
  computed: {
    ...mapGetters({
      isLoggedIn: "user/getUserStatus",
      user: "user/getUser"
    }),
    username() {
      return getProperty(["email"], this.user);
    }
  },
  methods: {
    ...mapActions({
      updateUser: "user/updateUser"
    }),
    logout() {
      this.currentUser = null;
        this.updateUser({
          currentUser: this.currentUser
        });
        netlifyIdentity.logout();
        this.$router.push({ path: "/" });
    }
    
  },
  data: () => ({
    //
  }),
};
</script>
