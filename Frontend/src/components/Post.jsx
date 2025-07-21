import React from 'react'
import Posts from './Posts'
import { useSelector } from 'react-redux'

const Post = () => {
  const {posts} = useSelector(store=>store.post)
  return (
    <div>
        {
            posts.map((post)=><Posts key={post._id} post={post} />)
        }
    </div>
  )
}

export default Post