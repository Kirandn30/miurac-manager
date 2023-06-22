import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Signup } from './Routes/Auth/Signup';
import { Signin } from './Routes/Auth/Signin';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setCompanyDetails, setLoading, setUser } from './redux/userSlice';
import { RootState } from './redux';
import { LoadingOverlay } from "@mantine/core"
import CompanayForm from './Routes/CompanyDetails/CompanayForm';
import { Home } from './Routes/Home/Home';
import { doc, getDoc } from 'firebase/firestore';
import { IconX } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import NavBar from './Components/NavBar';
import algoliasearch from 'algoliasearch';
import {
  InstantSearch,
  Configure
} from 'react-instantsearch-dom';

function App() {
  const { user, loading, CompanyDetails } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  const searchClient = algoliasearch(
    'WKD4SQHUQD',
    '3cc44358d94f7bc7b3842972876d1751'
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        dispatch(setUser(user))
        if (user) {
          const companyDetailsres = await getDoc(doc(db, "CompanyDetails", user.uid))
          if (companyDetailsres.exists()) {
            dispatch(setCompanyDetails(companyDetailsres.data()))
            dispatch(setLoading(false))
          } else {
            dispatch(setLoading(false))
          }
        }
      } catch (error) {
        showNotification({
          id: `reg-err-${Math.random()}`,
          autoClose: 5000,
          title: 'Error!',
          message: "Error getting details try again",
          color: 'red',
          icon: <IconX />,
          loading: false,
        });
      } finally {

      }
    })
    return () => unsubscribe()
  }, [])


  if (loading) {
    return <LoadingOverlay visible />
  }

  if (!user) {
    return (
      <div>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
        </Routes>
      </div>
    );
  } else if (user && !CompanyDetails) {
    return (
      <div>
        <CompanayForm />
      </div>
    )
  } else if (user && CompanyDetails) {
    return (
      <div>
        <InstantSearch
          searchClient={searchClient}
          indexName="projects"
        >
          <Configure hitsPerPage={10} />
        <NavBar >
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </NavBar>
        </InstantSearch>
      </div>
    )
  } else {
    return (<div></div>)
  }
}

export default App;