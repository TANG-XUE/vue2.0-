<template>
    <div class="seller" ref="sellerwrapper">
        <div class="seller-content">
          <div class="overview">
            <h1 class="title">{{this.seller.name}}</h1>
            <div class="desc border-1px">
              <star :size="36" :score="seller.score"></star>
              <span class="text">({{this.seller.ratingCount}})</span>
              <span class="text">月售{{this.seller.sellCount}}单</span>
            </div>
            <ul class="remark">
              <li class="block">
                <h2>起送价</h2>
                <div class="content">
                  <span class="stress">{{this.seller.minPrice}}</span>元
                </div>
              </li>
              <li class="block">
                <h2>商家配送</h2>
                <div class="content">
                  <span class="stress">{{this.seller.deliveryPrice}}</span>元
                </div>
              </li>
              <li class="block">
                <h2>平均配送时间</h2>
                <div class="content">
                  <span class="stress">{{this.seller.deliveryTime}}</span>分钟
                </div>
              </li>
            </ul>
            <div class="favorite" @click="toogleFavorite">
              <span class="icon-favorite" :class="{'active':favorite}"></span>
              <span class="text">{{favoriteText}}</span>
            </div>
          </div>
          <split></split>
          <div class="bulletin">
            <h1 class="title">公告与活动</h1>
            <div class="content-wrapper border-1px">
              <p class="content">{{seller.bulletin}}</p>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item border-1px" v-for="(item,index) in seller.supports">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
          </div>
          <split></split>
          <div class="pics">
            <h1 class="title">商家实景</h1>
            <div class="pic-wrapper">
              <swiper class="pic-list" ref="mySwiper" :options="swiperOptions">
                <swiper-slide class="pic-item" v-for="(pic,index) in this.seller.pics" :key="pic.id">
                  <img :src="pic" width="120" height="90" />
                </swiper-slide>
              </swiper>
            </div>
          </div>
          <split></split>
          <div class="info">
            <h1 class="title border-1px">商家信息</h1>
            <ul>
              <li class="info-item" v-for="(info,index) in this.seller.infos" :key="index">{{info}}</li>
            </ul>
          </div>
        </div>
    </div>
</template>

<script>
  import {mapActions, mapState,mapMutations} from "vuex";
  import BScroll from 'better-scroll';
  import Star from '@/components/star/Star'
  import Split from '@/components/split/Split'
  import { saveToLocal,loadFromlLocal } from "@/assets/js/store.js"

  export default {
    name: "Seller",
    data() {
        return {
          swiperOptions: {
            slidesPerView: 'auto',
          }
        }
    },
    created() {
      this.getDataAllList(),
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    mounted() {
        this.$nextTick(()=>{
          this._initScroll()
        })
    },
    computed:{
        ...mapState(['seller','favorite']),
        favoriteText(){
          return this.favorite?"已收藏":"收藏"
        }
      },
      methods:{
        ...mapActions(['getDataAllList']),
        ...mapMutations(['updateFavorite']),
        toogleFavorite(){
          this.updateFavorite(!this.favorite)
        },
        _initScroll(){
          this.scroll = new BScroll(this.$refs.sellerwrapper,{
            click:true
          })
        },
      },
      components: {
        Star,
        Split
      }
    }

</script>

<style lang="stylus" scoped>
  @import "../../assets/style/stylus/mixin.styl";
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .star
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          margin-right: 12px
          line-height: 18px
          vertical-align: top
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite
        position:absolute
        width:50px
        right:5px
        top:18px
        text-align:center
        .icon-favorite
          margin-bottom:4px
          display:block
          line-height:24px
          font-size:24px
          color:#d4d6d9
          &.active
            color:rgb(240,20,20)
        .text
          line-height:10px
          font-size:10px
          color:rgb(77,85,93)
    .bulletin
      padding:18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .content-wrapper
        padding:0px 12px 16 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          line-height:24px
          font-size:12px
          color: rgb(240, 20, 20)

      .supports
        .support-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 0
          &:last-child
            border-none()
        .icon
          display: inline-block
          width: 16px
          height: 16px
          vertical-align: top
          margin-right: 6px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            background-image:url("../../assets/images/decrease_4@3x.png")
          &.discount
            background-image:url("../../assets/images/decrease_4@3x.png")
          &.guarantee
            background-image:url("../../assets/images/guarantee_4@3x.png")
          &.invoice
            background-image:url("../../assets/images/invoice_4@3x.png")
          &.special
            background-image:url("../../assets/images/special_4@3x.png")
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 2)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 14px
      .info-item
        padding: 16px 12px
        line-height: 16px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
        &:last-child
          border-none()
</style>
