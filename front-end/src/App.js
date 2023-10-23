import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Footer from './components/footer';
import Signup from './components/Signup';
import PrivateComponent from './components/PrivateComponents';
import Login from './components/Login';
import AddProject from './components/addProject';
import ProjectList from './components/projectList';
import ProductAdd from './components/productAdd';
import ProductList from './components/allProductList';
import ProductDetails from './components/productDetails';
import UpdateProduct from './components/updateProduct';




function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav></Nav>
      <Routes>

        
        <Route element = {<PrivateComponent />}>
        <Route path='/' element={<ProjectList />}></Route>        
        <Route path='/add' element={<AddProject/>}></Route>
        <Route path='/update' element={<h1>Update Project Component</h1>}></Route>
        <Route path='/logout' element={<h1>Logout Component</h1>}></Route>
        <Route path='/profile' element={<h1>Profile Component</h1>}></Route>
        <Route path='/addProduct/:itemId/:projectName' element={<ProductAdd />} />
        <Route path='/productList/:itemId/:projectName' element={<ProductList />} />
        <Route path='/productDetails/:itemId/:projectName' element={<ProductDetails />} />
        <Route path='/updateProduct/:itemId/:projectName' element={<UpdateProduct />}></Route>
        </Route>

        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
