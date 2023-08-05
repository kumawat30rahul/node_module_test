import Books from "../Schema/BookSchema.js";

const BookModel = class {
    title;
    author;
    price;
    category;
    userkaname;

    constructor({ title, author, price, category,userkaname }) {
        (this.title = title);
          (this.author = author);
          (this.price = price);
          (this.category = category);
          this.userkaname = userkaname;
      }

      addingBook(){
        return new Promise(async (resolve,reject)=>{

            const Book = new Books({
               title: this.title,
               author: this.author,
               price: this.price,
               category: this.category,
               userkaname: this.userkaname,
            })

            console.log("this is book",Book);
            try{
                const bookdb = await Book.save() 
                resolve(bookdb)
            }catch(error){
                reject(error)
            }
        })
      }

      static bookPresent({title}){
        return new Promise(async (resolve,reject)=>{
            console.log("Working");
            try {
                const bookdb = await Books.findOne({title})
                console.log("this is from finding book",bookdb);

                if(bookdb){
                    reject("Book Already Present, Change the title")
                }

                resolve()
            } catch (error) {
                reject(error)
            }
        })
      }
}

export {BookModel}