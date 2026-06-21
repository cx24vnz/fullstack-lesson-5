import { render, screen } from "@testing-library/react";
import AddBlogForm from "./AddBlogForm";
import userEvent from "@testing-library/user-event";

test("<addBlogForm /> updates parent state and calls onSubmit", async () => {
  const sendNewBlog = vi.fn();
  const user = userEvent.setup();

  const credentialsAndUpdateState = { sendNewBlog };

  const { container } = render(
    <AddBlogForm {...credentialsAndUpdateState}></AddBlogForm>
  );
  screen.debug(container);

  const inputTitle = container.querySelector("#title");
  const inputAuthor = container.querySelector("#author");
  const inputUrl = container.querySelector("#url");
  const inputLikes = container.querySelector("#likes");

  await user.type(inputTitle, "testing a form...");
  await user.type(inputAuthor, "me");
  await user.type(inputUrl, "www.com");
  await user.type(inputLikes, "10");

  const sendButton = screen.getByText("Send blog");
  await user.click(sendButton);

  expect(sendNewBlog.mock.calls).toHaveLength(1);
  expect(sendNewBlog.mock.calls[0][1]).toBe("testing a form...");
  expect(sendNewBlog.mock.calls[0][2]).toBe("me");
  expect(sendNewBlog.mock.calls[0][3]).toBe("www.com");
  expect(sendNewBlog.mock.calls[0][4]).toBe("10");
});
