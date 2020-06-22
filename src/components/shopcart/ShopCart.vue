<template>
  <div class="shopcart">
    <!--底部去结算模块-->
    <div class="content" @click="totalList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-if="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price":class="{'highlight':totalCount>0}">¥{{totalPrice}}</div>
        <div class="desc">{{this.seller.deliveryPrice|deliveryPrice}}</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <!--小球运动的动画-->
    <div class="ball-container">
      <transition-group name="drop" @before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div class="ball" v-for="(ball,index) in balls" v-show="ball.show" :key="index">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
    <!--购物车列表-->
    <transition name='fadecart'>
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref='listContent'>
          <ul>
            <li class="food borderb" v-for='(food,index) in selectFoods' :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cart-control :food="food"></cart-control>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <!---->
    <transition name='fademask'>
      <div class="list-mask" v-show='listShow' @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
  import CartControl from '@/components/cartcontrol/CartControl'
  import BScroll from 'better-scroll'

  import {mapActions, mapState} from "vuex";

    export default {
      name: "ShopCart",
      props: {
      //从goods组件中传递过来的食物列表
        selectFoods: {
          type: Array,
          default() {
            return [  // 这个是测试数据，可以注释掉
              {
                price: 5,
                count: 20
              }
            ];  // 数组，每个值表示商品总价
          }
        },

      },
      data() {
          return {
            minPrice:this.$store.state.seller.minPrice,
            balls: [
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              }
            ],
            dropBalls: [],//已经下来的小球
            fold:true
          }
      },
      filters:{
        //配送费过滤器
        deliveryPrice(value){
          return  '另需配送费￥'+value+'元'
        },
      },
      computed:{
        ...mapState(['seller','goods']),
        //商品的总价
        totalPrice(){
          let total = 0;
          this.selectFoods.forEach((food)=>{
            total += food.price * food.count;
          })
          return total;
        },
        //选的商品的总和
        totalCount(){
          let count = 0;
          this.selectFoods.forEach((food)=>{
            count += food.count;
          })
          return count;
        },
        //去结算描述的文字
        payDesc(){
          if(this.totalPrice ===0){
            return `¥${this.minPrice}元起送`;
          }else if(this.totalPrice<this.minPrice){
            //还差多少元起送
            let diff = this.minPrice - this.totalPrice;
            return `还差¥${diff}元起送`;
          }else {
            return '去结算';
          }
        },
        //去结算的按钮样式返回 class为 not-enough或enough
        payClass(){
          if(this.totalPrice<this.minPrice){
            return 'not-enough';
          }else {
            return 'enough';
          }
        },
        //购物车列表的展示
        listShow(){
          if(!this.totalCount){
            this.fold = true;
            return false;
          }
          let show = !this.fold;
          if(show){
            this.$nextTick(()=>{
              if(!this.scroll){
                this.scroll = new BScroll(this.$refs.listContent,{
                  click:true
                })
              }else {
                this.scroll.refresh()
              }
            })
          }
          return show;
        }
      },
      methods:{
        ...mapActions(['getDataAllList']),

        // 小球的动画
        drop(el){
          for (let i=0;i<this.balls.length;i++){
            let ball = this.balls[i];
            if(!ball.show){
              ball.show = true; //显示小球
              ball.el = el; //保留当前的DOM对象，用来计算位置
              this.dropBalls.push(ball)
              return;
            }
          }
        },
        //显示隐藏购物车列表
        totalList(){
          if(!this.totalCount){
            return;
          }
          this.fold = !this.fold
        },
        //清空购物车
        empty(){
          this.selectFoods.forEach((food)=>{
            food.count = 0
          })
        },
        //点击半透明背景隐藏购物车
        hideList(){
          this.fold = !this.fold
        },
        //去结算
        pay(){
          if(this.totalPrice<this.minPrice){
            return;
          }
          window.alert(`支付${this.totalPrice}`)
        },
        beforeEnter: function (el) {
          /*el是小球;
        遍历所有show为true的小球*/
          let count = this.balls.length;
          while(count--) {
            let ball = this.balls[count];
            if(ball.show) {
              let rect = ball.el.getBoundingClientRect();//获得该元素（加号）相对于视口的位置的偏移（left,top）
              let x = rect.left-32;
              let y = -(window.innerHeight-rect.top-22);
              el.style.display = '';
              el.style.webkitTransform = `translate3d(0,${y}px,0)`;//外层做纵向运动
              el.style.transform = `translate3d(0,${y}px,0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
              inner.style.transform = `translate3d(${x}px,0,0)`;
            }
          }
        },
        enter: function (el) {
          let rf = el.offsetHeight;//必须重绘，再进行transform才有用
          this.$nextTick(() => {
            el.style.webkitTransform = 'translate3d(0,0,0)';//外层做纵向运动
            el.style.transform = 'translate3d(0,0,0)';
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0,0,0)';
            inner.style.transform = 'translate3d(0,0,0)';
          });
        },
        afterEnter: function (el) {
          let ball = this.dropBalls.shift();
          if(ball) {
            ball.show = false;
            el.style.display = 'none';
          }
        }
      },
      components: {
        CartControl
      }
    }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/style/stylus/mixin.styl";

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        .inner
          width 15px
          height 15px
          border-radius 50%
          background-color rgb(0, 160, 220)
          transition all 0.4s linear
        &.drop-enter-active,&.drop-leave-active
          transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
          .inner
            transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform translate3d(0, -100%, 0) //整个列表相对于当前自身的高度做一个偏移
      &.fadecart-enter-active, &.fadecart-leave-active
        transition: all 0.5s linear
        transform translate3d(0, -100%, 0) //每个表项相对于当前自身的高度做一个偏移
      &.fadecart-enter, &.fadecart-leave-active
        transform translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: -40
    opacity 1
    background rgba(7, 17, 27, 0.6)
    &.fademask-enter-active,&.fademask-leave-active
      opacity: 1
      transition: all 0.5s
      background: rgba(7, 17, 27,0.6)
    &.fademask-enter, &.fademask-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
