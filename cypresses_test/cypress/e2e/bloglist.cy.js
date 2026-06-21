
import '../support/commands';

let user1 = {
  name: 'root',
  username: 'root',
  password: 'root123!!!'
}

let userWithWrongPassword = {
  name: 'root',
  username: 'root',
  password: 'wrong'
}
let user2 = {
  name: 'root2',
  username: 'root2',
  password: 'root123!!!'
}

let blog1 = { title: "title", author: "Author test", url: "www", likes: "1" }
let blog2 = { title: "likeTest", author: "test2", url: "www", likes: "1" }
let blog3 = { title: "removeTest", author: "test2", url: "www", likes: "1" }
let blog4 = { title: "ShowRemoveButtonTest", author: "test3", url: "www", likes: "1" }

let blog5 = { title: "blogsFirstPlaceInLikes", author: "test3", url: "www", likes: "100" }
let blog6 = { title: "blogsSeccondPlaceInLikes", author: "test3", url: "www", likes: "99" }
let blog7 = { title: "blogsThirdPlaceInLikes", author: "test3", url: "www", likes: "97" }


function login(user) {
  cy.get('#username').type(user.name)
  cy.get('#password').type(user.password)
  cy.get('#loginButton').click()

}
function registerUser(user) {

  cy.request('POST', 'http://localhost:3003/api/users/', user)
}
function createBlog(blog) {
  let { title, author, url, likes } = blog

  cy.get('#createBlogButton').click()

  cy.get("#title").type(title)
  cy.get("#author").type(author)
  cy.get("#url").type(url)
  cy.get("#likes").type(likes)
  cy.get('#createSendBlogButton').click()



}

describe('Blog app', function () {
  beforeEach(function () {
    // vacía la base de datos aquí
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    // crea un usuario para el backend aquí

    registerUser(user1)
    registerUser(user2)




    // base url is 'http://localhost:5173'
    cy.visit('/')
  })

  it('Login form is shown', function () {

    cy.contains("username")
    cy.contains("password")
    cy.contains("login")


  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      login(user1)

      cy.contains("log in successfully")

      cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)');



    })

    it('fails with wrong credentials', function () {

      login(userWithWrongPassword)
      cy.contains("Wrong credentials")
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');



    })




  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.login(user1)
    })

    it('A blog can be created', function () {

      createBlog(blog1)

      cy.get(".blog").contains("Author test")

    })





  })

  describe('When logged in and created a blog', function () {
    beforeEach(function () {
      cy.login(user1)
      cy.createBlog(blog2)
      cy.createBlog(blog3)
      cy.createBlog(blog4)
    })

    it('A blog can be liked', function () {

      let selectedBlog = cy.get('.blog').contains(blog2.title)
      selectedBlog.find(".ExpandButton").click()

      selectedBlog = cy.get('.blog').contains(blog2.title).parent()
      selectedBlog.find(".likeButton").click()

      selectedBlog = cy.get('.blog').contains(blog2.title).parent()
      selectedBlog.find(".likeCount").should("contain", parseInt(blog2.likes) + 1)


    })
    it('A blog can be removed', function () {

      let selectedBlog = cy.get('.blog').contains(blog3.title)
      selectedBlog.find(".ExpandButton").click()

      selectedBlog = cy.get('.blog').contains(blog3.title).parent()
      selectedBlog.find(".deleteBlogButton").click()


      cy.should("not.contain", blog3.title)


    })
    it('not allow remove a blog created by a different user ', function () {


      cy.get("#logOutButton").click()
      cy.login(user2)
      let selectedBlog = cy.get('.blog').contains(blog4.title)

      selectedBlog.find(".ExpandButton").click()

      cy.get('.deleteBlogButton').should('not.exist')



    })






  })


  describe('When logged in and created a blog', function () {
    beforeEach(function () {
      cy.login(user1)
      cy.createBlog(blog5)
      cy.createBlog(blog6)
      cy.createBlog(blog7)
    })

    it('Blogs are ordered by likes', function () {

      cy.get('.blog').eq(0).should('contain', 'blogsFirstPlaceInLikes')
      cy.get('.blog').eq(1).should('contain', 'blogsSeccondPlaceInLikes')
      cy.get('.blog').eq(2).should('contain', "blogsThirdPlaceInLikes")
    })






  })




})
