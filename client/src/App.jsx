
import { BrowserRouter, Routes , Route} from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'

function App() {

  return (
    <>
   <BrowserRouter>
        <Routes>


          <Route path='/' element={<HomePage></HomePage>}></Route>
          {/* <Route path='/by-brand/:id' element={<ProductByBrand></ProductByBrand>}></Route>
          <Route path='/by-category/:id' element={<ProductByCategory></ProductByCategory>}></Route>
          <Route path='/by-keyword/:id' element={<ProductByKeyword></ProductByKeyword>}></Route>
          <Route path='/details/:id' element={<ProductDetails/>}></Route>



          <Route path='/about' element={<AboutPage/>}></Route>
          <Route path='/howtobuy' element={<HowtobuyPage/>}></Route>
          <Route path='/terms' element={<TermsPage/>}></Route>
          <Route path='/contact' element={<ContactPage/>}></Route>
          <Route path='/complain' element={<ComplainPage/>}></Route>
          <Route path='/privacy' element={<PrivacyPage/>}></Route>
          <Route path='/refund' element={<RefundPage/>}></Route>


          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/otp' element={<OTPPage/>}></Route>


          <Route path='/profile' element={<ProfilePage/>}></Route>


          <Route path='/cart' element={<CartPage/>}></Route>


          <Route path='/wish' element={<WishPage/>}></Route>



        <Route path='/orders/:id' element={<OrdersDetailsPage/>}></Route>
        <Route path='/orders' element={<OrderPage/>}></Route> */}


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
