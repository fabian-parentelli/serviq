import './blog.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { blogs } from '@/Utils/blogs.utils.js';

const Blog = () => {

    const { type } = useParams();
    const [doc, setDoc] = useState(null);
    useEffect(() => { setDoc(blogs.find(doc => doc.link === type)) }, [type]);

    return (
        <div className="blog">
            <h2>{doc?.title}</h2>
            <p>{doc?.subTitle}</p>
            <img src={doc?.img} alt="img" />
        </div>
    );
};

export default Blog;