<template>
    <div class="goods">
        <goods-list-item v-for="item in goods" :product="item" :key="item"></goods-list-item>
    </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem";
export default {
  components: { GoodsListItem },
    name:"GoodsList",
    comonents: {
        GoodsListItem
    },
    props:{
        goods: {
            type:Array,
            default(){
                return []
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .goods {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 5px;
    }
</style>