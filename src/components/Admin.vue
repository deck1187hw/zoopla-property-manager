<template>
  <v-container>
 <v-card>
    <v-card-title>
      Properties
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
    v-model="selected"
    :headers="headers"
    :search="search"
    sort-by="created"
    :items="properties"
    :single-select="singleSelect"
    show-expand
    item-key="id"
    show-select
    class="elevation-1"
  ><template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="900px" width="900px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Property</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container v-if="editedItem">
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.id" label="Property ID" disabled></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    Created: {{editedItem.created | moment('LLLL') }}
                    Updated: {{editedItem.updated | moment('LLLL') }}
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.name" label="Property name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.num_bedrooms" label="Num. Bedrooms"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.postcode" label="Postcode"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.asking_price" number :label="'Asking price ('+currency.symbol+')'"></v-text-field>
                    <strong v-if="editedItem.asking_price">{{numberWithCommas(editedItem.asking_price)}}{{currency.symbol}}</strong>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="editedItem.address" label="Full address"></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" sm="12" md="12">
                     <v-tabs>
                      <v-tab>Edit</v-tab>
                      <v-tab>Preview</v-tab>
                       <v-tab-item>
                        <v-card flat tile>
                          <v-card-text><v-textarea
                              outlined
                              v-model="editedItem.description"
                              label="Description (HTML)"
                              value=""
                            ></v-textarea></v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card flat tile>
                          <v-card-text><div v-html="editedItem.description"></div></v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <h3>Images</h3>
                    <p>(Not implemented) This will list the images for this property and and upload and remove button, the upload button will upload the image to the CDN and attach the URL (or the object) to this property.</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.created="{ item }">
      Created: {{item.created | moment('LLLL') }}<br>
      Updated: {{item.updated | moment('LLLL') }} <span>{{ item.updated | moment("from", "now") }}</span>
    </template>
    <template v-slot:item.images="{ item }">
      <Imageproperty :images="item.images" width="300" height="100" />
    </template>

    <template v-slot:item.expired="{ item }">
      <v-chip :color="getExpiredColor(item.expired)" dark>{{getExpiredText(item.expired)}}</v-chip>
    </template>
    <template v-slot:item.expired="{ item }">
      <v-chip :color="getExpiredColor(item.expired)" dark>{{getExpiredText(item.expired)}}</v-chip>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div class="pt-10 pl-10 pb-10">
  <v-tabs
      background-color="deep-blue accent-4"
      class="elevation-2"
      dark
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab>Info</v-tab>
      <v-tab>Images</v-tab>

      <v-tab-item>
        <v-card flat tile >
          <v-card-text>
             <ul class="p-10">
                    <li v-for="(it,index) in item" :key="index">
                      <strong>{{index}}:</strong>
                      {{it}}
                    </li>
                  </ul>
          </v-card-text>
        </v-card>
      </v-tab-item>

       <v-tab-item>
        <v-card flat tile >
          <v-card-text>
            <v-row>
            <v-col cols="3" v-for="(item, index) in item.images" :key="index">
             <v-img
                :src="item"
              ></v-img>
            </v-col>
          </v-row>

          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>

</div>
     </td>
      
    </template>


    <template v-slot:item.action="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">Reset</v-btn>
        </template>
  </v-data-table>
  </v-card>
  </v-container>
</template>
<script>
import Imageproperty from '../components/Imageproperty';
import { mapGetters } from "vuex";


export default {
  components: {
    Imageproperty
  },
  computed: {
    ...mapGetters({
      properties: "management/getProperties",
      currency: "management/getCurrency"
    }),
    formTitle () {
        return this.editedIndex === -1 ? 'New Property' : 'Edit Property'
    }
  },
  methods: {
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getExpiredColor(expired){
      return expired ? 'red' : 'success'
    },
    getExpiredText(expired){
      return expired ? 'Expired' : 'Active'
    },
    getProperties(){
      this.$store.dispatch("management/getProperties");
    },
    editItem (item) {
        this.editedIndex = this.properties.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
    },
    deleteItem (item) {
      const index = this.properties.indexOf(item)
      confirm('Are you sure you want to delete this property?') && this.properties.splice(index, 1)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      this.$store.dispatch("management/updateProperty", this.editedItem);
      if (this.editedIndex > -1) {
       // Object.assign(this.properties[this.editedIndex], this.editedItem)
        
      } else {
       // this.properties.push(this.editedItem)
      }
      this.close()
    },
  },
  mounted() {
    this.getProperties();
  },
  data: () => ({
    singleSelect: false,
        selected: [],
        dialog: false,
        search: '',
        editedIndex: -1,
        editedItem: {
          name: '',
          num_bedrooms: 0,
          postcode: '',
          asking_price: 0,
          address: '',
          description: '',
          created: null
        },
        defaultItem: {
          name: '',
          num_bedrooms: 0,
          postcode: '',
          asking_price: 0,
          address: '',
          description: '',
          created: null
        },
        headers: [
          { text: 'Images', value: 'images', sortable: false },
          { text: 'Id', value: 'id', sortable: true },
          { text: 'Name', value: 'name', sortable: true },
          { text: 'Created/Updated', value: 'created', sortable: true },
          { text: 'Bedrooms', value: 'num_bedrooms', sortable: true },
          { text: 'Postcode', value: 'postcode', sortable: true },
          { text: 'Name', value: 'asking_price', sortable: true },
          { text: 'Expired', value: 'expired', sortable: true },
          { text: 'Actions', value: 'action', sortable: false },
        ],        
  }),
};
</script>
