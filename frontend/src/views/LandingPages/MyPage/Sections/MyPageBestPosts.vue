<script setup>
import RotatingCard from '../components/RotatingCard.vue';
import RotatingCardFront from "../components/RotatingCardFront.vue";
import RotatingCardBack from '../components/RotatingCardBack.vue';
import LikeCounter from "../components/LikeCounter.vue";

import post1 from "@/assets/img/examples/testimonial-6-2.jpg";
import post2 from "@/assets/img/examples/testimonial-6-3.jpg";
import post3 from "@/assets/img/examples/blog-9-4.jpg";
import post4 from "@/assets/img/examples/blog2.jpg";
</script>
<template>
  <section class="py-2">
    <div class="container">
      <div class="row">
        <h3 class="mb-5">인기 게시물</h3>
      </div>
      <div class="row">
        <div class="col-lg-3 col-sm-6">
          <RotatingCard>
            <RotatingCardFront :image="post1" />
            <RotatingCardBack :image="post1" title="사진 위치" description="사진 설명" :action="[
              {
                route: '/',
                label: '지도에서 확인하기',
              },
            ]" />
          </RotatingCard>
          <LikeCounter color="warning" :count="100" suffix="♥️" :duration="2000" />

        </div>
        <div class="col-lg-3 col-sm-6">
          <RotatingCard>
            <RotatingCardFront :image="post2" />

            <RotatingCardBack :image="post2" title="사진 위치" description="사진 설명" :action="[
              {
                route: '/',
                label: '지도에서 확인하기',
              },
            ]" />
          </RotatingCard>
          <div class="col-auto">
            <span class="h6 me-1">♥️ 3.5k</span>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6">
          <RotatingCard>
            <RotatingCardFront :image="post3" />

            <RotatingCardBack :image="post3" title="사진 위치" description="사진 설명" :action="[
              {
                route: '/',
                label: '지도에서 확인하기',
              },
            ]" />
          </RotatingCard>
          <div class="col-auto">
            <span class="h6 me-1">♥️ 3.5k</span>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6">
          <RotatingCard>
            <RotatingCardFront :image="post4" />

            <RotatingCardBack :image="post4" title="사진 위치" description="사진 설명" :action="[
              {
                route: '/',
                label: '지도에서 확인하기',
              },
            ]" />
          </RotatingCard>
          <div class="col-auto">
            <span class="h6 me-1">♥️ 3.5k</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
