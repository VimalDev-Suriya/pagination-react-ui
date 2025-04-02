import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

const PAGE_SIZE = 10;

function App() {
  const [comments, setComments] = useState({
    data:[],
    loading: false,
    error: null
  });

  const [currentPage, setCurrentPage] = useState(0)
  
  const fetchData = async() => {
    // Loader
    setComments(prev => ({
      ...prev,
      data: null,
      loading: true,
      error: null
    }));

    try {
      const data = await axios.get('https://jsonplaceholder.typicode.com/comments');
      setComments(prev => ({
        ...prev,
        data: data.data,
        loading: false,
        error: null
      }));
    } catch (error) {
      setComments(prev => ({
        ...prev,
        data: null,
        loading: false,
        error: error
      }));
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const totalComments = comments.data?.length;
  const noOfPages = Math.ceil(totalComments / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const handleChange = n => {
    setCurrentPage(n)
  }

  const handleNext = () => {
    setCurrentPage(prev => prev+1)
  }

  const handlePrev = () => {
    setCurrentPage(prev => prev-1)
  }

  if(comments.loading){
    return <div>Loading</div>
  }

  if(comments.error){
    return <div>Some error</div>
  }

  return (
    <>
      <h1>Pagination</h1>
      <div>
        <button disabled={currentPage === 0} onClick={handlePrev}>Prev</button>
        {
          [...Array(noOfPages).keys()].map((id) => 
            <span key={id} className='page-id' onClick={()=>handleChange(id)}>{id+1}</span>
          )
        }
        <button disabled={currentPage === noOfPages-1} onClick={handleNext}>Next</button>
      </div>

      {
        comments.data.slice(start, end).map((comment, idx) => {
          return <div className='comment' key={comment.id}>
            <h1 style={{marginRight:"0.5rem"}}>{comment.id}</h1>
            <h2>{comment.name}</h2>
            <p>{comment.body}</p>
          </div>
        })
      }
    </>
  )
}

export default App
