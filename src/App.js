import { Fragment, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from './components/Layouts/DefaultLayout';
import { publicRoutes } from './routes';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function App() {
  const [ page, setPage ] = useState();
  const [ changeAvatar, setChangeAvatar ] = useState(false);

  return (
    <PayPalScriptProvider 
      options={{ 'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID }}
    >
      <BrowserRouter>
        <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
  
              let Layout = DefaultLayout;
  
              if(route.layout){
                Layout = route.layout;
              }else if(route.layout === null){
                Layout = Fragment;
              }
  
              return <Route key={index} path={route.path} element={<Layout changeAvatar={changeAvatar} page={page}><Page handleSetPage={setPage} changeAvatar={setChangeAvatar} /></Layout>} />
            })}
          </Routes>
        </div>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;
