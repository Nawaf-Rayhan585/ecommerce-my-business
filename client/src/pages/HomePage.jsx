import React from 'react'
import Layout from '../components/layout/layout.jsx'
import Brands from '../components/product/brands.jsx'
import Slider from '../components/product/slider.jsx'
import Features from '../components/features/features.jsx'
import Categories from '../components/product/categories.jsx'
import Products from '../components/product/products.jsx'

const HomePage = () => {
  return (
  <Layout>

      <Slider/>
      <Features/>
      <Categories/>
      <Products/>
      <Brands/>

    </Layout>
  )
}

export default HomePage
