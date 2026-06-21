import { useState } from "react";
import AddFormInput from "./AddFormInput";
import blogService from "../services/blogs";

const AddBlogForm = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [likes, setLikes] = useState("");

  const {
    username,
    password,
    setRequireUpdateBlogs,
    activateNotification,
    togglableRef,
    sendNewBlog,
  } = props;

  const sendBlogHandle = async (event) => {
    event.preventDefault();
    console.log("send new blog  with", username, password);

    await sendNewBlog(
      togglableRef,
      title,
      author,
      url,
      likes,
      setRequireUpdateBlogs,
      activateNotification
    );
  };

  return (
    <div>
      <h2>Add blog</h2>

      <div>
        <AddFormInput
          id="titleInputBlog"
          value={title}
          name="title"
          setter={setTitle}
        />
        <AddFormInput
          id="authorInputBlog"
          value={author}
          name="author"
          setter={setAuthor}
        />
        <AddFormInput
          id="urlInputBlog"
          value={url}
          name="url"
          setter={setUrl}
        />
        <AddFormInput
          id="likesInputBlog"
          value={likes}
          name="likes"
          setter={setLikes}
        />

        <button id="createSendBlogButton" onClick={sendBlogHandle}>
          {" "}
          Send blog{" "}
        </button>
      </div>
    </div>
  );
};

export default AddBlogForm;
