<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import {Server} from '@/stores/ajax'
let routesData = $ref([])
Server.get('/travel_route/get_routes').then(res => {
    if (res.data && res.data.code == 0) {
        routesData = res.data.return
    }
})
let rankData = $ref([])
Server.get('/travel_route/get_rank').then(res => {
    if (res.data && res.data.code == 0) {
        rankData = res.data.return
    }
})
let carouselList = $ref([
    {
        image_url: "344941316c26bb463b486910bb9c31d.png",
        text: "在古老的钟塔上俯瞰整座城市",
        rid: 1018
    },
    {
        image_url: "368547ded8d7db9f0bdafc5d76d3748.png",
        text: "在梦境中阐述最真实的自己",
        rid: 1022
    },
    {
        image_url: "faa2b70177d8587701b7040fcd128f6.png",
        text: "在静谧的异域中享受午后",
        rid: 1023
    },
    {
        image_url: "1f91b94a936aeda6cd8cc66f85b1e1c.png",
        text: "在纯真的包围中回忆童年",
        rid: 1019
    },
])
let carouselIndex = $ref(0)
</script>

<template>
    <div class="block text-center" style="margin-bottom: 10px;">
        <el-carousel height="300px" :interval="4000" type="card" @change="(i1: number) => carouselIndex = i1">
            <el-carousel-item v-for="(item, index) in carouselList" :key="index"
                style="min-width: 610px;max-width: 610px;">
                <a :href="'/route/' + item.rid">
                    <h4 v-show="carouselIndex == index" class="carousel-title">{{ item.text}}</h4>
                    <el-image :src="Server.fileBaseURL + item.image_url" fit="cover"
                        style="height:300px;width: 610px;" />
                </a>
            </el-carousel-item>
        </el-carousel>
    </div>
    <el-row :gutter="0">
        <el-col :span='20'>
            <div>
                <h2>路线一览</h2>
                <div class="routes" style="margin-top: 10px;">
                    <div>
                        <el-space wrap :size="30">
                            <span v-for="item in routesData as any" style="width:150px; height: 130px">
                                <a :href="'route/' + item.rid">
                                    <el-image :src="Server.fileBaseURL + item.image_path"
                                        style="width:150px; height: 100px" fit='cover' />
                                </a> {{ item.name}}
                            </span>
                        </el-space>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :span='4'>
            <div style="min-width: 180px;">
                <h2>排行榜</h2>
                <el-divider style="margin: 5px 0;" />
                <div v-for="(item, index) in rankData as any">
                    <div style="margin-top: 5px; font-size: 13px;">
                        <span style="vertical-align: middle;display: inline-block;margin-right: 5px;"
                            :style="index == 0 ? 'color:red;' : ''">{{ index +
                                    1
                            }} </span>
                        <el-link :href="'/route/' + item.rid">
                            {{ item.name}}</el-link>
                        <span style="vertical-align: middle;display: inline-block;float: right;">{{ (item.routescore -
                                -0
                            ).toFixed(2)
                        }} 分</span>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<style>
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.carousel-title {
    position: absolute;
    width: 380px;
    line-height: 35px;
    bottom: 20px;
    color: white;
    letter-spacing: 2px;
    padding-left: 15px;
    background: linear-gradient(to right, rgba(33, 33, 33, 0.4) 0%, rgba(33, 33, 33, 0.39) 1%, rgba(178, 178, 178, 0.21) 31%, rgba(88, 88, 88, 0) 66%, rgba(0, 0, 0, 0) 100%);
    z-index: 20;
    animation: fadenum 1.5s 1;
}

@keyframes fadenum {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>
