<template>
  <div>
    <div class="testimonials-subheading">
      What our customers think
    </div>
    <div class="testimonials-carousel-container">
      <b-carousel class="testimonials-carousel"
        :arrow="false"
        :repeat="true"
        :indicator="false"
        :autoplay="false"
        >
        <b-carousel-item v-for="(testimonial, i) in testimonials" :key="i">
          <section class="`hero is-medium`">
            <div class="has-text-centered testimonial-card">
              <div class="text">{{testimonial.text}}</div>
              <div class="author">-{{testimonial.author}}</div>
            </div>
          </section>
        </b-carousel-item>
      </b-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testimonials: [
        {
          text: "I love my blend jet! It's so cute and works great! Makes it easy to have a meal on the go.",
          author: 'Chloe A'
        }
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
.testimonials-subheading {
  text-align: center;
  font-family: Bold;
  font-size: $text-small;
  color: $primary-purple;
  line-height: 1.17;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  margin-top: 20px;

}
.testimonials-carousel-container {
  display: flex;
  justify-content: center;
}

.testimonials-carousel {
  width: 55vw;
  @media screen and (max-width: 768px) {
    width: auto;
  }
}

.testimonial-card {
  color: $primary-purple;
  font-family: BoldItalic;
  font-size: 29px;
  line-height: 1.14;
  letter-spacing: 1px;
  padding: 2rem;
}

.text {
  color: $primary-purple;
  text-align: center;
}

.author {
  font-family: Bold;
  font-size: $text-small;
  line-height: 1.17;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  margin-top: 50px;
}

.quote {
  margin: 36px;
}
</style>