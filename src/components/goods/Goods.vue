<template>
    <div class="goods">
      <div class="menu-wrapper" ref="menuwrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item"  :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)" :key="index"
              >
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodswrapper">
        <ul>
          <li v-for="(item,index) in goods" class="food-list" :key="index" ref="foodlisthook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)" v-for="(food,index) in item.foods" class="food-item border-1px" :key="index">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cart-control :food="food" @cartadd="cartAdd"></cart-control>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <shop-cart ref="shopcart" :select-foods="selectFoods"></shop-cart>
      </div>
      <food :food="selectedFood" ref="food" @cartadd="cartAdd"></food>
    </div>
</template>

<script>
  import ShopCart from '@/components/shopcart/ShopCart'
  import CartControl from '@/components/cartcontrol/CartControl'
  import Food from '@/components/food/Food'
  import BScroll from 'better-scroll'
  import {mapActions,mapState} from 'vuex'
    export default {
        name: "Goods",
        data() {
            return {
              listHeight:[], //存储区块的高度
              scrollY: 0, //滚动的高度
              selectedFood: {}
            }
        },
        mounted() {

        },
        created() {
          this.getDataAllList()
          //对应的样式名
          this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
          this.$nextTick(()=>{
            this._initScroll()
            //调用高度
            this._calculateHeight()
          })
        },
        computed:{
          ...mapState(['goods']),
          currentIndex() { //currentIndex对应菜单栏的下标
            for (let i = 0; i < this.listHeight.length; i++) {
              let height1 = this.listHeight[i];
              let height2 = this.listHeight[i + 1];
              //获得了一个区间的上下范围，判断scrollY落到这个区间，!height2是判断最后一个区间
              //避免i溢出，>= 向下的是一个闭区间，这样第一个就会高亮了
              if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                return i;
              }
            }
            return 0;
          },
          //自动将所有的goods.food添加一个count属性,方便做数量运算
          selectFoods() {//遍历foods，看看选中了哪些商品
            let foods = [];
            this.goods.forEach((good) => { //先取到每一个分类
              good.foods.forEach((food) => { //后取到每一个分类下的不同food
                if (food.count) {  //有count表示被选择
                  foods.push(food);//两层遍历，取到所有被选中的foods
                }
              });
            });
            return foods;
          }
        },
        methods:{
          ...mapActions(['getDataAllList']),

          //点击跳到指定的类别商品
          selectMenu(index, event) {
            if (!event._constructed) {  //去掉自带的click事件点击，即pc端直接返回
              return;
            }
            // console.log(this.$refs.foodlisthook[index]) //获取当前点击的索引值的右侧li的节点
            // //类似jump to的功能,通过这个方法,跳转到指定的dom
            this.foodsScroll.scrollToElement(this.$refs.foodlisthook[index],300)
          },
          //被选中商品展示详情页
          selectFood(food, event) {
            if (!event._constructed) {
              return;
            }
            this.selectedFood = food;
            this.$refs.food.show();
          },

          //BSscroll封装的方法
          _initScroll(){
            this.menuScroll = new BScroll(this.$refs.menuwrapper,{
              click:true
            })
            this.foodsScroll = new BScroll(this.$refs.foodswrapper,{
              click:true,
              probeType:3  //希望在滚动的时候监听实时位置
            })
            //监听一个scroll，当滚动的时候将位置暴露出来
            this.foodsScroll.on('scroll',(pos)=>{
              this.scrollY = Math.abs(Math.round(pos.y))  //监听滚动的高度
            })
          },
          //获取当前的高度
          _calculateHeight(){
            let foodList = this.$refs.foodlisthook //获取每一个food的dom对象
            let height = 0;
            this.listHeight.push(height); //初始化第一个高度为0
            for (let i = 0; i < foodList.length; i++) {
              let item = foodList[i]; //每一个item都是刚才获取的food的每一个dom
              height += item.clientHeight; //主要是为了获取每一个foods内部块的高度
              this.listHeight.push(height);
            }
          },

          //接收cartcontrol中cardadd事件
          cartAdd(target){
            //拿到traget(DOM对象)之后，将其传入shopcart组件中drop(target){}方法，
            //此处用this.$refs调用子组件,访问DOM时用的是ref="menuWrapper"
            this.$nextTick(() => { //回调函数异步执行，两个动画效果就不会卡顿了
              this.$refs.shopcart.drop(target); //给shop-cart组件发送一个事件
            });
          }
        },

        components: {
          ShopCart,
          CartControl,
          Food
        }
    }

</script>

<style lang="stylus" scoped>

  @import "../../assets/style/stylus/mixin.styl";
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            background-image:url('../../assets/images/decrease_3@3x.png')
          &.discount
            background-image:url('../../assets/images/discount_3@3x.png')
          &.guarantee
            background-image:url('../../assets/images/guarantee_3@3x.png')
          &.invoice
            background-image:url('../../assets/images/invoice_3@3x.png')
          &.special
            background-image:url('../../assets/images/special_3@3x.png')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px

    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px

</style>
