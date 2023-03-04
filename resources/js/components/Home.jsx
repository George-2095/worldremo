import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form, Button, Carousel } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Home() {
    const [authUser, setAuthUser] = useState([])

    const [uploadGallery, setUploadGallery] = useState([])
    const [post, setPost] = useState('')
    const [postError, setPostError] = useState('')

    const [posts, setPosts] = useState([])
    const [gallery, setGallery] = useState([])

    useEffect(() => {
        axios.get("./authuser").then(response => {
            setAuthUser(response.data)
        }).catch(error => console.log(error))

        axios.get("./posts").then(response => {
            setPosts(response.data)
        }).catch(error => console.log(error))

        axios.get("./files").then(response => {
            setGallery(response.data)
        }).catch(error => console.log(error))
    }, [])

    const MakePost = () => {
        if (post === '') {
            setPostError('The post field is required.')
        } else {
            setPostError('')

            const formData = new FormData();
            for (let i = 0; i < uploadGallery.length; i++) {
                const element = uploadGallery[i];
                formData.append("gallery[]", element)
            }
            formData.append("post", post)
            axios.post("./makepost",
                formData,
                {
                    headers: {
                        'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    if (response.data === '') {
                        document.location.reload()
                    } else {
                        console.log(response.data)
                    }
                }).catch(error => console.log(error))
        }
    }

    const DeletePost = (id) => {
        const formData = new FormData()
        formData.append("id", id)
        axios.post("./deletepost",
            formData,
            {
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
                }
            }
        ).then(response => {
            if (response.data === '') {
                document.location.reload()
            } else {
                console.log(response.data)
            }
        }).catch(error => console.log(error))
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label htmlFor='gallery'>Gallery</Form.Label>
                <input type="file" id="gallery" className="form-control" onChange={e => setUploadGallery(e.target.files)} multiple />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label htmlFor='post'>Post</Form.Label>
                <textarea id="post" rows="10" className="form-control" value={post} onChange={e => setPost(e.target.value)}></textarea>
                <b className="text-danger">{postError}</b>
            </Form.Group>
            <Button variant="success" onClick={() => MakePost()}>Submit</Button>
            <hr />
            {
                (posts.length) ? (
                    posts.map(post => (
                        <div className="post" key={post.id}>
                            <div className="d-flex justify-content-between">
                                <Link to={'user/' + post.postbyid}>{post.postby}</Link>
                                {
                                    authUser.map(authuser => {
                                        if (post.postbyid == authuser.id) {
                                            return (
                                                <div key={authuser.id}>
                                                    <Button variant="danger" onClick={() => DeletePost(post.id)}>X</Button>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                            <hr />
                            <b>{post.post}</b>
                            {
                                (gallery.filter(item => item.postid = post.id).length) ? (
                                    (gallery.filter(item => item.postid = post.id).length === 1) ? (
                                        gallery.filter(item => item.postid = post.id).map(galleryitem => (
                                            (galleryitem.type === 'mp4') ? (
                                                <div key={galleryitem.id}>
                                                    <center>
                                                        <video controls>
                                                            <source src={'/images/' + galleryitem.name} type="video/mp4" />
                                                        </video>
                                                    </center>
                                                </div>
                                            ) : (
                                                <div key={galleryitem.id}>
                                                    <center>
                                                        <img src={"/images/" + galleryitem.name} alt={galleryitem.name} />
                                                    </center>
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        <Carousel interval={null}>
                                            {
                                                gallery.filter(item => item.postid = post.id).map(galleryitem => (
                                                    (galleryitem.type === 'mp4') ? (
                                                        <Carousel.Item key={galleryitem.id}>
                                                            <center>
                                                                <video controls>
                                                                    <source src={'/images/' + galleryitem.name} type="video/mp4" />
                                                                </video>
                                                            </center>
                                                        </Carousel.Item>
                                                    ) : (
                                                        <Carousel.Item key={galleryitem.id}>
                                                            <center>
                                                                <img src={"/images/" + galleryitem.name} alt={galleryitem.name} />
                                                            </center>
                                                        </Carousel.Item>
                                                    )
                                                ))
                                            }
                                        </Carousel>
                                    )
                                ) : (<></>)
                            }
                        </div>
                    ))
                ) : (<></>)
            }
        </>
    )
}

export default Home