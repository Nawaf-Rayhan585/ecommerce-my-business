import React from 'react'
import Layout from '../components/layout/layout.jsx'
import TopProducts from '../components/product/topproducts.jsx'
import Slider from '../components/product/slider.jsx'
import Features from '../components/features/features.jsx'
import Categories from '../components/product/categories.jsx'
import Products from '../components/product/products.jsx'

const HomePage = () => {
  return (
  <Layout>

      <Slider/>
      <TopProducts/>
      <Features/>
      <Categories/>
      <Products/>


    </Layout>
  )
}

export default HomePage
