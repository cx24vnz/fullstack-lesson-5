import { useState } from "react";
import blogService from "../services/blogs";

const Blog = (props) => {
  const {
    setRequireUpdateBlogs,
    activateNotification,

    blog,
    user,
    likeHandle,
  } = props;
  const [expanded, setExpanded] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  function expandedhandle() {
    setExpanded(!expanded);
  }

  async function deleteHandle() {
    if (!window.confirm("Remove blog " + blog.title)) {
      return;
    }

    try {
      await blogService.deleteBlog(blog.id);
      setRequireUpdateBlogs(true);
      activateNotification("blog deleted", "success");
    } catch (error) {
      activateNotification("Something went wrong:  " + error, "error");
    }
  }

  let deleteComponent;

  if (blog.user?.username === user?.username) {
    deleteComponent = (
      <button class="deleteBlogButton" onClick={deleteHandle}>
        {" "}
        Remove
      </button>
    );
  }

  if (expanded) {
    return (
      <div className="blog" style={blogStyle}>
        <h2>
          {blog.title} {blog.author}{" "}
          <button className="ExpandButton" onClick={expandedhandle}>
            {" "}
            Hide
          </button>
        </h2>
        {blog.url}
        <div className="divOneLine">
          <p class="likeCount"> Likes {blog.likes}</p>
          <button className="likeButton" onClick={likeHandle}>
            {" "}
            Like
          </button>
        </div>

        {blog.user?.username}

        <br />
        {deleteComponent}
      </div>
    );
  }

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <button className="ExpandButton" onClick={expandedhandle}>
        {" "}
        View
      </button>
    </div>
  );
};

export default Blog;
