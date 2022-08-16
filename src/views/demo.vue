<template>
  <div class="container">
    <swiper :options="swiperOption">
      <swiper-slide>
        <a href="javascript:;">
          <img src="../assets/images/03.webp" />
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="javascript:;">
          <img src="../assets/images/07.webp" />
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="javascript:;">
          <img src="../assets/images/04.webp" />
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="javascript:;">
          <img src="../assets/images/05.webp" />
        </a>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  name: 'demo-swiper',
  data() {
    return {
      /* slideList: [
        {
          id: '42',
          img: '../assets/images/16.webp'
        },
        {
          id: '45',
          img: './../assets/images/04.webp'
        },
        {
          id: '46',
          img: './../assets/images/05.webp'
        },
        {
          id: '',
          img: './../assets/images/06.webp'
        },
        {
          id: '',
          img: './../assets/images/07.webp'
        }
      ], */
      swiperOption: {
        autoplay: true,
        loop: true,
        effect: 'cube',
        cubeEffect: {
          slideShadows: true,
          shadow: true,
          shadowOffset: 100,
          shadowScale: 0.6
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  components: {
    Swiper,
    SwiperSlide
  }
}
</script>

<style scoped>
.container {
  margin-left: 300px;
  width: 926px;
  height: 500px;
  background-color: antiquewhite;
}
.container img {
  width: 926px;
  height: 500px;
}
.swiper-button-prev {
  top: 225px;
}
.swiper-button-next {
  top: 225px;
}
</style>