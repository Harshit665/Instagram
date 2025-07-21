import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed' 
import RightSideBar from './RightSideBar'
import useGetAllPosts from '@/hooks/useGetAllPosts'

const Home = () => {
  useGetAllPosts();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div>
      <RightSideBar/>
    </div>
  )
}

export default Home