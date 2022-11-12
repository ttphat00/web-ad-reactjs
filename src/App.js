import { Fragment, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from './components/Layouts/DefaultLayout';
import { publicRoutes } from './routes'

function App() {
  const [ page, setPage ] = useState();

  return (
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

            return <Route key={index} path={route.path} element={<Layout page={page}><Page handleSetPage={setPage} /></Layout>} />
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
