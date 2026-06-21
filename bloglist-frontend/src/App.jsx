import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";
import AddBlogForm from "./components/AddBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";

const Notification = ({ message, notificationType }) => {
  if (message === null) {
    return null;
  }

  return <div className={notificationType}>{message}</div>;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [requireUpdateBlogs, setRequireUpdateBlogs] = useState(true);

  const [message, setMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(
    "some error happened..."
  );

  const togglableRef = useRef();

  async function sendNewBlog(
    togglableRef,
    title,
    author,
    url,
    likes,
    setRequireUpdateBlogs,
    activateNotification
  ) {
    try {
      togglableRef.current.toggleVisibility();
      await blogService.create({
        title,
        author,
        url,
        likes,
      });
      setRequireUpdateBlogs(true);
      activateNotification("Blog added", "success");
    } catch (exception) {
      activateNotification("Wrong credentials, " + exception, "error");
    }
  }

  function activateNotification(message, type) {
    setMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }

  const credentialsAndUpdateState = {
    username,
    password,
    setRequireUpdateBlogs,
    activateNotification,
    togglableRef,
    user,
    sendNewBlog,
  };
  async function likeHandle(blog) {
    const blogUpdated = { ...blog };
    blogUpdated["likes"] = blogUpdated["likes"] + 1;

    try {
      await blogService.update(blogUpdated.id, blogUpdated);
      setRequireUpdateBlogs(true);
      activateNotification("like added", "success");
    } catch (error) {
      activateNotification("Something went wrong:  " + error, "error");
    }
  }

  const logOutHandle = () => {
    activateNotification("log out successfully", "success");
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      activateNotification("log in successfully", "success");
    } catch (exception) {
      activateNotification("Wrong credentials, " + exception, "error");
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          id="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="loginButton" type="submit">
        login
      </button>
    </form>
  );

  const blogAdding = () => {
    blogs.sort((a, b) => {
      return b.likes - a.likes;
    });

    return (
      <div>
        <h2>blogs</h2>
        {blogs.map((blog) => (
          <Blog
            {...credentialsAndUpdateState}
            key={blog.id}
            blog={blog}
            likeHandle={() => {
              likeHandle(blog);
            }}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (requireUpdateBlogs) {
      setRequireUpdateBlogs(false);
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [requireUpdateBlogs]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <div>
      <Notification message={message} notificationType={notificationType} />
      <button id="logOutButton" onClick={logOutHandle}>
        log Out
      </button>
      {user !== null && (
        <Togglable
          id="createBlogButton"
          buttonLabel="Create blog"
          ref={togglableRef}
        >
          <AddBlogForm {...credentialsAndUpdateState}></AddBlogForm>
        </Togglable>
      )}

      {user === null && loginForm()}

      {user !== null && blogAdding()}
    </div>
  );
};

export default App;
