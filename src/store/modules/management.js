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
    }
};

const actions = {
    addProperty: ({commit}, payload) => {
        
    },
    updateProperty: ({commit, getters}, payload) => {
        //XHR request with Auth headers would go here... Changing only the state...
     
        commit("setLoading", true);
        let mutatedProps = getters.getProperties

        getters.getProperties.forEach(function(item, index){
            if(mutatedProps[index].id === payload.id){  
                mutatedProps[index] = payload    
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