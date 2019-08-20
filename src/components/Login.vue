<template>
  <v-container>
     <v-flex mb-4>
        <v-card v-if="!isLoggedIn" max-width="344" class="mx-auto">
 
          <v-card-text>
            <div class="pr-10 pl-10 pt-5">
              <v-flex xs12>
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
        ></v-img>
      </v-flex>
          </div>
          <div class="text-center">
            <h3>Admin area</h3>
            <p>
              You are not logged in.</p>
              <p>
                User: miguelpuig@gmail.com<br>
                Pass: zoopla2020
                </p>
            <p>
              <v-btn
                class="mt-3"
                outlined
                color="primary"
                large
                @click="triggerNetlifyIdentityAction('login')"
              ><v-icon small>mdi-lock-outline</v-icon> Log On</v-btn>
            </p>
            </div>
          </v-card-text>
        </v-card>
</v-flex>
  </v-container>
</template>

<script>
import netlifyIdentity from "netlify-identity-widget";
import { mapGetters, mapActions } from "vuex";
import { getProperty } from "../utils/helper";

netlifyIdentity.init({
  APIUrl: process.env.VUE_APP_IDENTITY_URL,
  logo: false 
});

export default {
  data: () => ({
    
  }),
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
    triggerNetlifyIdentityAction(action) {
      if (action == "login" || action == "signup") {
        netlifyIdentity.open(action);
        netlifyIdentity.on(action, user => {
          this.currentUser = {
            username: user.user_metadata.full_name,
            email: user.email,
            access_token: user.token.access_token,
            expires_at: user.token.expires_at,
            refresh_token: user.token.refresh_token,
            token_type: user.token.token_type
          };
          this.updateUser({
            currentUser: this.currentUser
          });
          netlifyIdentity.close();
        });
      } else if (action == "logout") {
        this.currentUser = null;
        this.updateUser({
          currentUser: this.currentUser
        });
        netlifyIdentity.logout();
        this.$router.push({ path: "/" });
      }
    }
   }
};
</script>
