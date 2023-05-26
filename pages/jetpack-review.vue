<template>
	<div class="page" style="max-width:1200px;margin: 0 auto;">


<!-- JETPACKS CROSS-SELL -->
<!-- TODO: THIS COMPONENT SHOULD BE VARIANT BASED -->
<h1 class="page__title">Which would you like to review?</h1>
			<div class="row">
				<div class="column">
					<a href="https://blendjet.com/collections/jetpack-ready-to-blend-smoothies/products/banana-blueberry-jetpack-ready-to-blend-smoothie?ref=review"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/products/Banana-Blueberry_JetPack_932acb45-3723-4aca-ab40-f510e401d7b8_600x600.png"></a>
					
					<a href="https://blendjet.com/collections/jetpack-ready-to-blend-smoothies/products/tropical-blue-jetpack-smoothie?ref=review"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/products/Tropical-Blue_JetPack_d2f2e956-9c5e-4eda-add6-c7efa44223fb_600x600.png"></a>
					
				</div>
					
				<div class="column">
					
					<a href="https://blendjet.com/collections/jetpack-ready-to-blend-smoothies/products/raspberry-dragon-fruit-jetpack-smoothie?ref=review"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/products/Raspberry-Dragon-Fruit_JetPack_2b473ed6-6a6d-48f6-9b4f-ece3193da68a_600x600.png"></a>

					<a href="https://blendjet.com/collections/jetpack-ready-to-blend-smoothies/products/mango-matcha-jetpack-smoothie?ref=review"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/products/Mango-Matcha_JetPack_704d0b46-b6c2-49ef-a6a5-f380a81806b2_600x600.png"></a>
					
				</div>

				<div class="column">
					
					<a href="https://blendjet.com/collections/jetpack-ready-to-blend-smoothies/products/green-peach-ginger-jetpack-ready-to-blend-smoothie?ref=review"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/products/Green-Peach-Ginger_JetPack_b84396fb-1423-4260-ba92-d2020d78e118_600x600.png"></a>
					
					<a href="https://blendjet.com/collections/jetpack-ready-to-blend-smoothies/products/mocha-chia-jetpack-ready-to-blend-smoothie?ref=review"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/products/Mocha-Chia_JetPack_32a422b4-c90c-469e-a942-7c1e837c8a11_600x600.png"></a>
				</div>
			</div>
			</div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
	.page__title {
    font-family: Medium;
    font-size: 32px;
    text-transform: uppercase;
    color: #999999;
    line-height: 1.29;
    letter-spacing: 6px;
    padding-top: 60px;
    margin-bottom: 60px;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px;
  margin-bottom: 100px;
}

/* Create four equal columns that sits next to each other */
.column {
  flex: 33%;
  max-width: 33%;
  padding: 0 4px;
}

.column img {
  margin-top: 50px;
  vertical-align: middle;
  width: 100%;
}

/* Responsive layout - makes the two columns stack on top of each other instead of next to each other */
@media screen and (max-width: 600px) {
  .column {
    flex: 100%;
    max-width: 100%;
  }
  	.page__title {
	     font-size: 26px;
	 }
}
</style>