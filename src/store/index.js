import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {getDataAll} from "../api";

export default new Vuex.Store({
  state:{
    goods:JSON.parse(localStorage.getItem("goodsList"))||[],
    seller:JSON.parse(localStorage.getItem("sellersList"))||[],
    ratings:JSON.parse(localStorage.getItem("ratingsList"))||[],
    favorite:localStorage.getItem('favorite') || false
  },
  mutations:{
    dataList(state,value){
      state.goodsList = value.goods;
      state.sellersList = value.seller;
      state.ratingsList = value.ratings
    },
    updateFavorite(state,value){
      state.favorite = value
      localStorage.setItem('favorite',value)
    }
  },
  actions:{
    getDataAllList(context){
      return new Promise((resolve,rej) => {
        getDataAll().then((result)=>{
          context.commit('dataList',result.data)
          localStorage.setItem('goodsList',JSON.stringify(result.data.goods))
          localStorage.setItem('sellersList',JSON.stringify(result.data.seller))
          localStorage.setItem('ratingsList',JSON.stringify(result.data.ratings))
          resolve();
        })
      })
    }
  },
  getters:{

  }
})
