<template>
  <div>
    <!-- Hero Section -->
    <section
      id="home"
      class=" min-h-screen my-10"
    >
      <div class="container">
        <div class="grid lg:grid-cols-12 gap-8 ">
          <div class="col-span-3" />
          <!-- On-Sale Products (expanded full width while header shows categories) -->
          <div class="relative col-span-9 bg-white rounded-lg overflow-hidden shadow-2xl px-6 py-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">
                Sản phẩm bán chạy
              </h2>
              <div class="flex gap-2">
                <button class="products-prev w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button class="products-next w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Products Swiper -->
            <ClientOnly>
              <Swiper
                :modules="[Navigation, Grid]"
                :slides-per-view="3"
                :slides-per-group="3"
                :space-between="16"
                :loop="false"
                :grid="{ rows: 3, fill: 'row' }"
                :navigation="{ nextEl: '.products-next', prevEl: '.products-prev' }"
                :breakpoints="{
                  640: { slidesPerView: 2, slidesPerGroup: 2, grid: { rows: 2, fill: 'row' }, spaceBetween: 12 },
                  768: { slidesPerView: 2, slidesPerGroup: 2, grid: { rows: 3, fill: 'row' }, spaceBetween: 16 },
                  1024: { slidesPerView: 2, slidesPerGroup: 2, grid: { rows: 2, fill: 'row' }, spaceBetween: 16 },
                  1536: { slidesPerView: 3, slidesPerGroup: 3, grid: { rows: 3, fill: 'row' }, spaceBetween: 16 },
                }"
                class="products-swiper"
              >
                <SwiperSlide
                  v-for="(product, index) in sampleProducts"
                  :key="index"
                >
                  <div class="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden h-[180px] flex">
                    <div class="flex  gap-4 p-4 w-full">
                      <!-- Left Content -->
                      <div class="w-1/2 flex flex-col justify-between h-full">
                        <div>
                          <h3 class="font-bold text-gray-900 text-base mb-1 line-clamp-2 leading-tight">
                            {{ product.name }}
                          </h3>
                          <p class="text-gray-600 text-xs mb-2 line-clamp-2">
                            Carefully Sourced, Kept Chilled, And Delivered The Same.
                          </p>
                          <!-- Price -->
                          <div class="mb-2">
                            <span class="text-xl font-bold text-gray-900">${{ product.salePrice }}</span>
                          </div>
                        </div>
                        
                        <!-- Add Button -->
                        <button class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm">
                          <Icon
                            icon="mdi:cart-plus"
                            class="w-4 h-4"
                          />
                          Add
                        </button>
                      </div>
                      
                      <!-- Right Image -->
                      <div class="w-1/2 relative">
                        <img 
                          :src="product.image" 
                          :alt="product.name" 
                          class="w-full h-full object-cover rounded-lg"
                        >
                        <button class="absolute top-1 right-1 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                          <Icon
                            icon="mdi:heart-outline"
                            class="w-4 h-4 text-gray-600 hover:text-red-500"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>
    <!-- Best Selling Section -->
    <section
      id="best-selling"
      class="py-20 bg-white"
    >
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-16">
          Best Selling
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1544943910-4c1dc44aab44?q=80&w=400&auto=format&fit=crop" 
                alt="Atlantic Salmon" 
                class="w-full h-full object-cover"
              >
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Atlantic Salmon
            </h3>
            <p class="text-gray-600">
              Fresh, premium quality
            </p>
          </div>
          <div class="text-center">
            <div class="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=400&auto=format&fit=crop" 
                alt="King Crab" 
                class="w-full h-full object-cover"
              >
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              King Crab
            </h3>
            <p class="text-gray-600">
              Live and cooked options
            </p>
          </div>
          <div class="text-center">
            <div class="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=400&auto=format&fit=crop" 
                alt="Fresh Shrimp" 
                class="w-full h-full object-cover"
              >
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Fresh Shrimp
            </h3>
            <p class="text-gray-600">
              Wild caught, jumbo size
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section
      id="products"
      class="py-20 bg-gradient-to-r from-red-500 to-orange-500 text-white"
    >
      <div class="container mx-auto px-6">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-4xl font-bold">
            Products
          </h2>
          <button class="bg-white text-red-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            View All
          </button>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1544943910-4c1dc44aab44?q=80&w=300&auto=format&fit=crop" 
              alt="Product 1" 
              class="w-full h-48 object-cover"
            >
            <div class="p-4">
              <h3 class="font-semibold text-gray-800">
                Fresh Salmon Fillet
              </h3>
              <p class="text-red-500 font-bold">
                $24.99/lb
              </p>
            </div>
          </div>
          <div class="bg-white rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=300&auto=format&fit=crop" 
              alt="Product 2" 
              class="w-full h-48 object-cover"
            >
            <div class="p-4">
              <h3 class="font-semibold text-gray-800">
                Lobster Tail
              </h3>
              <p class="text-red-500 font-bold">
                $18.99/each
              </p>
            </div>
          </div>
          <div class="bg-white rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=300&auto=format&fit=crop" 
              alt="Product 3" 
              class="w-full h-48 object-cover"
            >
            <div class="p-4">
              <h3 class="font-semibold text-gray-800">
                Jumbo Shrimp
              </h3>
              <p class="text-red-500 font-bold">
                $16.99/lb
              </p>
            </div>
          </div>
          <div class="bg-white rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=300&auto=format&fit=crop" 
              alt="Product 4" 
              class="w-full h-48 object-cover"
            >
            <div class="p-4">
              <h3 class="font-semibold text-gray-800">
                Sea Bass
              </h3>
              <p class="text-red-500 font-bold">
                $22.99/lb
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How We Ship Section -->
    <section
      id="how-we-ship"
      class="py-20 bg-orange-50"
    >
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-16">
          How We Ship
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=300&auto=format&fit=crop" 
              alt="Packaging" 
              class="w-full h-48 object-cover rounded-xl shadow-lg mb-6"
            >
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Expert Packaging
            </h3>
            <p class="text-gray-600">
              Temperature-controlled packaging ensures freshness
            </p>
          </div>
          <div class="text-center">
            <img 
              src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=300&auto=format&fit=crop" 
              alt="Delivery" 
              class="w-full h-48 object-cover rounded-xl shadow-lg mb-6"
            >
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Fast Delivery
            </h3>
            <p class="text-gray-600">
              Next-day delivery to maintain peak freshness
            </p>
          </div>
          <div class="text-center">
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=300&auto=format&fit=crop" 
              alt="Quality" 
              class="w-full h-48 object-cover rounded-xl shadow-lg mb-6"
            >
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Quality Guarantee
            </h3>
            <p class="text-gray-600">
              100% satisfaction or your money back
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section
      id="testimonials"
      class="py-20 bg-white"
    >
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-16">
          Testimonials
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-8 rounded-xl shadow-lg">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                J
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">
                  John Smith
                </h4>
                <p class="text-gray-600 text-sm">
                  Chef
                </p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "The quality is exceptional. My restaurant customers always compliment the freshness of the seafood."
            </p>
          </div>
          <div class="bg-gray-50 p-8 rounded-xl shadow-lg">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">
                  Maria Garcia
                </h4>
                <p class="text-gray-600 text-sm">
                  Home Cook
                </p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Fast delivery and amazing quality. My family loves the fresh salmon we order every week."
            </p>
          </div>
          <div class="bg-gray-50 p-8 rounded-xl shadow-lg">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                D
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">
                  David Chen
                </h4>
                <p class="text-gray-600 text-sm">
                  Restaurant Owner
                </p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Reliable supplier with consistent quality. Perfect for our high-end restaurant needs."
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, A11y, Grid } from 'swiper/modules'
import { Icon } from '@iconify/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/grid'

// Sample products data
 const sampleProducts = [
   {
     name: 'Boneless Chicken Breasts',
     category: 'Poultry',
     image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
     originalPrice: '96.00',
     salePrice: '55.00'
   },
   {
     name: 'Aged Pork Steak Beef',
     category: 'Beef Meat',
     image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
     originalPrice: '96.00',
     salePrice: '55.00'
   },
   {
     name: 'Premium Ribeye Steak',
     category: 'Beef Meat',
     image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=800&auto=format&fit=crop',
     originalPrice: '120.00',
     salePrice: '89.00'
   },
   {
     name: 'Fresh Ground Beef',
     category: 'Beef Meat',
     image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=800&auto=format&fit=crop',
     originalPrice: '45.00',
     salePrice: '32.00'
   },
   {
     name: 'Lamb Chops',
     category: 'Lamb Meat',
     image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop',
     originalPrice: '150.00',
     salePrice: '110.00'
   },
   {
     name: 'Pork Tenderloin',
     category: 'Pork Meat',
     image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop',
     originalPrice: '75.00',
     salePrice: '58.00'
   },
   {
     name: 'Fresh Salmon Fillet',
     category: 'Seafood',
     image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
     originalPrice: '85.00',
     salePrice: '65.00'
   },
   {
     name: 'Jumbo Shrimp',
     category: 'Seafood',
     image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=800&auto=format&fit=crop',
     originalPrice: '95.00',
     salePrice: '72.00'
   },
   {
     name: 'Organic Turkey Breast',
     category: 'Poultry',
     image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=800&auto=format&fit=crop',
     originalPrice: '68.00',
     salePrice: '49.00'
   },
   {
     name: 'Wagyu Beef Strips',
     category: 'Premium Beef',
     image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
     originalPrice: '200.00',
     salePrice: '155.00'
   },
   {
     name: 'Fresh Cod Fillet',
     category: 'Seafood',
     image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?q=80&w=800&auto=format&fit=crop',
     originalPrice: '55.00',
     salePrice: '42.00'
   },
   {
     name: 'Duck Breast',
     category: 'Poultry',
     image: 'https://images.unsplash.com/photo-1574781330855-d0db2706b3d0?q=80&w=800&auto=format&fit=crop',
     originalPrice: '88.00',
     salePrice: '67.00'
   }
 ]

// Page metadata
useHead({
  title: 'Fresh Seafood - From Boat to Your Home',
  meta: [
    { name: 'description', content: 'Premium quality seafood delivered fresh to your doorstep. Experience the ocean\'s finest catch with our sustainable fishing practices.' }
  ]
})
</script>