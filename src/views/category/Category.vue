<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品分类</template>
    </nav-bar>

    <div id="mainbox">
      <div class="ordertab">
        <van-tabs v-model="active" @click="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评价排序"></van-tab>
        </van-tabs>
      </div>

      <van-sidebar class="leftmenu" v-model="activeKey">
        <van-collapse v-model="activeName" accordion>
          <van-collapse-item
            v-for="(item, index) in categories"
            :key="index"
            :title="item.name"
            :name="item.name"
          >
            <van-sidebar-item
              v-for="sub in item.children"
              :key="sub.id"
              :title="sub.name"
              @click="getGoods(sub.id)"
            />
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>

      <div class="goodslist">
        <div class="content">
          <van-card
            v-for="item in showGoods"
            :key="item.id"
            @click="itemClick(item.id)"
            :num="item.comments_count"
            :tag="item.comments_count >= 0 ? '流行' : '标签'"
            :price="item.price"
            :desc="item.updated_at"
            :title="item.title"
            :thumb="item.cover_url"
            :lazy-load="true"
          />
        </div>
      </div>
    </div>
    <back-top @bTop="bTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import BackTop from "../../components/common/backtop/BackTop";
import { ref, reactive, onMounted, computed, watchEffect, nextTick } from "vue";
import { getCategory, getCategoryGoods } from "network/category";
import {useRouter} from 'vue-router';
import BScroll from "better-scroll";

export default {
  name: "Category",
  setup() {
    const router = useRouter();
    let activeKey = ref(0);

    let activeName = ref(1);

    let active = ref(1);

    let categories = ref([]);

    let currentCid = ref(0);

    let currentOrder = ref("sales");

    let bscroll = reactive({});

    let isShowBackTop = ref(false);
    const goods = reactive({
      sales: { page: 0, list: [] },
      price: { page: 0, list: [] },
      comments_count: { page: 0, list: [] },
    });

    const showGoods = computed(() => {
      return goods[currentOrder.value]?.list;
    });

    const init = () => {
      getCategoryGoods("sales", currentCid.value).then((res) => {
        goods.sales.list = res.goods.data;
      });

      getCategoryGoods("price", currentCid.value).then((res) => {
        goods.price.list = res.goods.data;
      });

      getCategoryGoods("comments_count", currentCid.value).then((res) => {
        goods.comments_count.list = res.goods.data;
      });
    };

    onMounted(() => {
      getCategory().then((res) => {
        categories.value = res.categories;
      });
      init();

      bscroll = new BScroll(document.querySelector(".goodslist"), {
        probeType: 3, // 0, 1, 2, 3, 3 只要在运运就触发scroll事件
        click: true, // 是否允许点击
        pullUpLoad: true, //上拉加载更多， 默认是false
      });

      bscroll.on("scroll", (position) => {
        isShowBackTop.value = -position.y > 300;
      });

      bscroll.on("pullingUp", () => {
        console.log("上拉加载更多.....");

        const page = goods[currentOrder.value].page + 1;

        getCategoryGoods(currentOrder.value, currentCid.value, page).then(
          (res) => {
            goods[currentOrder.value].list.push(...res.goods.data);
            goods[currentOrder.value].page += 1;
          }
        );

        bscroll.finishPullUp();

        bscroll.refresh();
      });
    });

    const tabClick = (index) => {
      let orders = ["sales", "price", "comments_count"];

      currentOrder.value = orders[index];

      getCategoryGoods(currentOrder.value, currentCid.value).then((res) => {
        goods[currentOrder.value].list = res.goods.data;

        nextTick(() => {
          // 重新计算高度
          bscroll && bscroll.refresh();
        });
      });
    };

    const getGoods = (cid) => {
      currentCid.value = cid;
      init();
      console.log(cid);
    };

    watchEffect(() => {
      nextTick(() => {
        bscroll && bscroll.refresh();
      });
    });

    const bTop = () => {
      bscroll.scrollTo(0, 0, 300);
    };

    return {
      activeKey,
      categories,
      activeName,
      active,
      tabClick,
      currentOrder,
      getGoods,
      currentCid,
      goods,
      showGoods,
      bscroll,
      isShowBackTop,
      bTop,
      itemClick:(id)=>{
        router.push({path:'/detail',query:{id}})
      }
    };
  },
  components: {
    NavBar,
    BackTop,
  },
};
</script>

<style scoped lang="scss">
#mainbox {
  margin-top: 45px;
  display: flex;
  .ordertab {
    flex: 1;
    height: 50px;
    position: fixed;
    top: 45px;
    z-index: 9;
    right: 0;
    left: 130px;
  }

  .leftmenu {
    width: 130px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
  }

  .goodslist {
    flex: 1;
    height: 200px;
    position: absolute;
    top: 100px;
    left: 130px;
    right: 0;
    height: 100vh;
    padding: 10px;
    text-align: left;
  }
}
</style>