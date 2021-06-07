import React from 'react'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'

const ServicesPage = () => (
  <Layout>
    <PageHeader
     title="Gatsby Shopify Storefront Demo Store"
     subtitle="Some sample products"
      backgroundImage="../images/NShoreLRG.jpg"
    />
    <section className="section">
      <div className="container">
        <ProductGrid />
      </div>
    </section>
  </Layout>
)

export default ServicesPage
