import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

test("renders title", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "me",
    url: "url",
    likes: 12,
  };

  render(<Blog blog={blog} />);
  console.log("test");

  const element = screen.getByText(
    "Component testing is done with react-testing-library",
    { exact: false }
  );

  expect(element).toBeDefined();
});

test("renders only title and author", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "me",
    url: "url",
    likes: 12,
  };

  const { container } = render(<Blog blog={blog} />);
  const blogElement = container.querySelector(".blog");

  expect(blogElement).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
  expect(blogElement).toHaveTextContent("me");

  expect(blogElement).not.toHaveTextContent("url");
  expect(blogElement).not.toHaveTextContent("12");
});

test("clicking the button shows likes and URL", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "me",
    url: "url",
    likes: 12,
  };

  const { container } = render(<Blog blog={blog} />);
  const blogElement = container.querySelector(".blog");

  const user = userEvent.setup();
  const button = blogElement.querySelector(".ExpandButton");

  await user.click(button);

  expect(blogElement).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
  expect(blogElement).toHaveTextContent("me");

  expect(blogElement).toHaveTextContent("url");
  expect(blogElement).toHaveTextContent("12");
});

test("clicking twice call the handle twice", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "me",
    url: "url",
    likes: 12,
  };

  const mockHandler = vi.fn();
  let likeHandle = mockHandler;

  const { container } = render(
    <Blog key={blog.id} blog={blog} likeHandle={likeHandle} />
  );
  const blogElement = container.querySelector(".blog");

  const user = userEvent.setup();
  const button = blogElement.querySelector(".ExpandButton");

  await user.click(button);

  const likeButton = container.querySelector(".likeButton");

  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
