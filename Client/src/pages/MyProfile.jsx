import React from 'react'
import { Header } from '../components/Header'
import Profile from '../components/Profile'

const MyProfile = (props) => {
  return (
<>
<Header loggedIn={props.loggedIn} toggleLogged={props.toggleLogged} />
<Profile />
</> )
}

export default MyProfile