function generateBooks() {
  axios
    .get("/read-books")
    .then((response) => {
      const data = response.data; // This will contain the data returned from the server
      console.log("ha ha ye hi", data);
      const allBooks = document.getElementById("all-books");
        if(data.length === 0){
            console.log("yes");
            allBooks.innerHTML = `<p style="color: white;">No Books Present As of now</p>`
            return 
        }
      allBooks.innerHTML = data
        .map((book) => {
          return `
          <div
          data-book-id="${book._id}"
            style="
              width: 300px;
              height: 300px;
              background-color: white;
              border-radius: 5px;
              display: flex;
              flex-direction: column;
              /* align-items: flex-start; */
              justify-content: space-between;
              margin-bottom: '10px';
            "
          >
            <div
              id="info"
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                padding: 10px;
              "
            >
              <span class="book-title" style="font-size: 60px; color: navy; font-weight: bold; width: 250px; word-wrap: break-word;">
                ${book.title}
              </span>
              <span class="book-author" style="color: black">By ${book.author}</span>
              <span class="book-category" style="color: black; font-weight: bold">${book.category}</span>
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <button
                class="Update"
                style="
                  width: 100%;
                  height: 50px;
                  background-color: navy;
                  color: white;
                  border: none;
                  border-radius: 5px;
                  cursor:pointer;
                "
                data-id="${book._id}"
              >
                Update
              </button>
              <form action="/delete" method="post"  style="
              width: 100%;">
              <button
                class="delete"
                style="
                width: 100%;
                height: 50px;
                background-color: red;
                color: white;
                border: 1px solid black;
                border-radius: 5px;
                cursor: pointer
                "
                data-id="${book._id}"
              >
                    Delete
              </button>
              </form>
            </div>
          </div>
        `;
        })
        .join(""); // Added the 'join' method to concatenate the generated HTML strings into a single string
      const updateButtons = document.querySelectorAll(".Update");

      updateButtons.forEach((updateButton) => {
        updateButton.addEventListener("click", (event) => {
          const bookId = updateButton.getAttribute("data-id");
          const bookElement = document.querySelector(
            `[data-book-id="${bookId}"]`
          );
          const titleElement = bookElement.querySelector(".book-title");
          const authorElement = bookElement.querySelector(".book-author");
          const categoryElement = bookElement.querySelector(".book-category");

          // Get the existing title, author, and category
          const currentTitle = titleElement.textContent.trim();
          const currentAuthor = authorElement.textContent
            .replace("By ", "")
            .trim();
          const currentCategory = categoryElement.textContent.trim();

          // Prompt the user to update the book information
          const newTitle = prompt("Write the Title", currentTitle);
          const newAuthor = prompt("Write the Author", currentAuthor);
          const newCategory = prompt("Write the Category", currentCategory);

          // Check if the user provided input for title, author, and category
          // If not, retain the existing values
          const finalTitle = newTitle === null ? currentTitle : newTitle;
          const finalAuthor = newAuthor === null ? currentAuthor : newAuthor;
          const finalCategory =
            newCategory === null ? currentCategory : newCategory;

          // Send the update request to the server
          axios
            .post("/update", {
              id: bookId,
              title: finalTitle,
              author: finalAuthor,
              category: finalCategory,
            })
            .then((response) => {
              console.log(response);
              if (response.data.status !== 200) {
                alert(response.data.message);
                return;
              }

              // Update the book information in the UI
              titleElement.textContent = finalTitle;
              authorElement.textContent = `By ${finalAuthor}`;
              categoryElement.textContent = finalCategory;
              alert(response.data.message);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      });

      const deleteButtons = document.querySelectorAll(".delete");

      // Add event listener to each delete button
      deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the default form submission behavior
          const id = deleteButton.getAttribute("data-id");
          console.log("id", id);

          // Send the delete request to the server
          axios
            .post("/delete", { id })
            .then((response) => {
              console.log(response);
              if (response.data.status !== 200) {
                alert(response.data.message);
                return;
              }

              const bookId = deleteButton.getAttribute("data-id");
              const bookElement = document.querySelector(
                `[data-book-id="${bookId}"]`
              );
              if (bookElement) {
                bookElement.remove();
              }

              alert(response.data.message);


              // You can also update the UI here to remove the deleted book from the list
            })
            .catch((error) => {
              console.error(error);
            });
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

generateBooks();

// allBooks.addEventListener("click", (event) => {
//     if (event.target.matches("#delete")) {
//         console.log("triggered");
//       const id = event.target.getAttribute("data-id");
//       console.log("id",id);
//       axios.post("/delete", { id }).then((response) => {
//         console.log(response);
//       }).catch((error) => {
//         console.error(error);
//       });
//     }
//   });
