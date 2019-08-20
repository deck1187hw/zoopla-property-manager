import axios from 'axios'
const state = {
    properties: []
};

const getters = {
    getProperties: state => state.properties
};

const mutations = {
    setProperties: (state, payload) => {
        state.properties = payload
    }
};

const actions = {
    getProperties: ({ commit }) => {
        const token = localStorage.getItem('user')
        const authToken = JSON.parse(token)
        commit("setLoading", true);
        axios
        .get('/.netlify/functions/application-get-all', { 'headers': { 'Authorization': `Bearer ${authToken.access_token}`  } })
        .then(applications => {
            const apps = applications.data.map(function(item){
                return {
                    id: item.ref['@ref'].id,
                    data: item.data.data
                }
            })
            commit('setApplications', apps)
            commit("setLoading", false);
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