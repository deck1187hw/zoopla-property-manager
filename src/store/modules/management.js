import axios from 'axios'
import Vue from 'vue';

const state = {
    properties: [],
    loading: false,
    currency: {
        name: 'GBP',
        symbol: '£'
    }
};

const getters = {
    getProperties: state => state.properties,
    getCurrency: state => state.currency,
    getLoading: state => state.loading
};

const mutations = {
    setProperties: (state, payload) => {
        Vue.set(state, 'properties', [...payload]);
    },
    setLoading: (state, payload) => {
        state.loading = payload
    },
    removeProperty: (state, payload) => {
        let i = state.properties.map(item => item.id).indexOf(payload.id);
        state.properties.splice(i, 1);
    },
    addProperty: (state, payload) => {
        let newProps =  state.properties
        // Dynamic fields will go here...
        newProps.push({
            id: Math.floor((Math.random() * 999999) + 1),
            name: payload.name || '',
            num_bedrooms: payload.num_bedrooms || '',
            postcode: payload.postcode || '',
            asking_price: payload.asking_price || 0,
            address: payload.address || '',
            description: payload.description || '',
            created: new Date(),
            images: payload.image || [],
            expired: payload.expired || false,
            updated: new Date()
        })
        Vue.set(state, 'properties', [...newProps]);


    }
};

const actions = {
    deleteProperty: ({commit}, payload) => {   
        //XHR request with Auth headers would go here... Changing only the state...
        //Validation from utils/helper.js happens here before committing...
        commit("setLoading", true);
        commit("removeProperty", payload);
        commit("setLoading", false);
        
    },
    addProperty: ({commit}, payload) => {   
        //XHR request with Auth headers would go here... Changing only the state...
        //Custom validation from utils/helper.js happens here before committing...
        commit("setLoading", true);
        commit("addProperty", payload);
        commit("setLoading", false);
        
    },
    updateProperty: ({commit, getters}, payload) => {
        //XHR request with Auth headers would go here... Changing only the state...
        //Custom validation from utils/helper.js happens here before committing...
        commit("setLoading", true);
        let mutatedProps = getters.getProperties
        getters.getProperties.forEach(function(item, index){
            if(mutatedProps[index].id === payload.id){  
                mutatedProps[index] = payload
                mutatedProps[index].updated = new Date()
            }
        })
        commit("setLoading", false);
        commit('setProperties', mutatedProps)
    },
    getProperties: ({ commit }) => {
        //XHR request with Auth headers would go here...
        const token = localStorage.getItem('user')
        const authToken = JSON.parse(token)
        commit("setLoading", true);
        axios
        .get('./data/dummy_properties.json', { 'headers': { 'Authorization': `Bearer ${authToken.access_token}`  } })
        .then(properties => {
            commit('setProperties', properties.data)
        })
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}